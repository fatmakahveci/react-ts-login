import { test, expect, type APIRequestContext } from '@playwright/test';
import { Pool } from 'pg';
const origin = 'http://127.0.0.1:3100';
const password = 'a-long-test-passphrase-2026';
async function emailLink(request: APIRequestContext, email: string, kind: 'verify-email' | 'reset-password') {
  let link = '';
  await expect.poll(async () => {
    const response = await request.get('http://127.0.0.1:8026');
    const messages: { to: string[]; raw: string }[] = await response.json();
    for (const message of messages.filter(item => item.to.includes(email)).reverse()) {
      const [headers, ...parts] = message.raw.split('\r\n\r\n');
      let text = parts.join('\r\n\r\n');
      if (/Content-Transfer-Encoding: base64/i.test(headers)) text = Buffer.from(text.replace(/\s/g, ''), 'base64').toString();
      else text = text.replace(/=\r?\n/g, '').replace(/=3D/g, '=');
      const urls = text.match(/http:\/\/127\.0\.0\.1:3100\/[^\s<>]+/g) || [];
      link = urls.find(url => url.includes(kind)) || '';
      if (link) break;
    }
    return Boolean(link);
  }).toBe(true);
  return link;
}

test('real account lifecycle, private tasks, profile, recovery, and session expiration', async ({ page, request }, testInfo) => {
  const email = `forma-${testInfo.project.name}-${Date.now()}@example.test`;
  await page.goto('/register');
  await page.getByLabel('Your name', { exact: true }).fill('Forma Tester');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: /Create account/ }).click();
  await expect(page.getByRole('status')).toContainText('verification link');
  const unverified = await request.post('/api/auth/sign-in/email', { headers: { Origin: origin }, data: { email, password } });
  expect(unverified.status()).toBe(403);
  await page.goto(await emailLink(request, email, 'verify-email'));
  await expect(page.getByRole('status')).toContainText('email is verified');
  await page.goto('/');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: /Sign in/ }).click();
  await expect(page).toHaveURL(/\/workspace$/);
  const sessionCookie = (await page.context().cookies()).find(cookie => cookie.name.endsWith('session_token'));
  expect(sessionCookie?.httpOnly).toBe(true);
  expect(sessionCookie?.sameSite).toBe('Lax');
  await page.getByLabel('What would you like to do?').fill('Ship a useful workspace');
  await page.getByRole('button', { name: 'Add task', exact: true }).click();
  await expect(page.getByText('Ship a useful workspace', { exact: true })).toBeVisible();
  await page.getByRole('checkbox', { name: 'Complete: Ship a useful workspace' }).click();
  await expect(page.getByRole('checkbox', { name: 'Reopen: Ship a useful workspace' })).toBeChecked();
  const tasks = await (await page.request.get('/api/tasks')).json();
  const unauthenticated = await request.get('/api/tasks');
  expect(unauthenticated.status()).toBe(401);
  const csrf = await page.request.post('/api/tasks', { headers: { Origin: 'https://attacker.example' }, data: { title: 'CSRF' } });
  expect(csrf.status()).toBe(403);
  await page.getByLabel('Your name', { exact: true }).fill('Updated Name');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('status')).toContainText('Changes saved');
  await page.reload();
  await expect(page.getByText(/Updated Name/).first()).toBeVisible();
  await page.screenshot({ path: `test-results/workspace-${testInfo.project.name}.png`, fullPage: true });
  // A second real user cannot read or mutate the first user's task.
  const secondEmail = `second-${testInfo.project.name}-${Date.now()}@example.test`;
  const signup = await request.post('/api/auth/sign-up/email', { headers: { Origin: origin }, data: { email: secondEmail, password, name: 'Second User', callbackURL: '/verify-email?verified=1' } });
  expect(signup.ok()).toBe(true);
  await request.get(await emailLink(request, secondEmail, 'verify-email'));
  expect((await request.post('/api/auth/sign-in/email', { headers: { Origin: origin }, data: { email: secondEmail, password } })).ok()).toBe(true);
  expect(await (await request.get('/api/tasks')).json()).toEqual([]);
  expect((await request.patch(`/api/tasks/${tasks[0].id}`, { headers: { Origin: origin }, data: { completed: false } })).status()).toBe(404);
  expect((await request.delete(`/api/tasks/${tasks[0].id}`, { headers: { Origin: origin } })).status()).toBe(404);
  await page.getByLabel('Current password').fill(password);
  await page.getByLabel('New password').fill(`${password}-changed`);
  await page.getByRole('button', { name: 'Change password', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Password changed');
  // Keep a separate session to prove password reset revokes existing sessions.
  await request.post('/api/auth/sign-out', { headers: { Origin: origin }, data: {} });
  expect((await request.post('/api/auth/sign-in/email', { headers: { Origin: origin }, data: { email, password: `${password}-changed` } })).ok()).toBe(true);
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page).toHaveURL('/');
  await page.goto('/forgot-password');
  await page.getByLabel('Email address').fill(email);
  await page.getByRole('button', { name: /Send reset link/ }).click();
  await expect(page.getByRole('status')).toContainText('If an account exists');
  await page.goto(await emailLink(request, email, 'reset-password'));
  const resetToken = new URL(page.url()).searchParams.get('token');
  await page.getByLabel('New password').fill(`${password}-reset`);
  await page.getByRole('button', { name: /Reset password/ }).click();
  await expect(page.getByRole('status')).toContainText('password has been updated');
  expect((await request.get('/api/tasks')).status()).toBe(401);
  const reused = await request.post('/api/auth/reset-password', { headers: { Origin: origin }, data: { token: resetToken, newPassword: `${password}-reuse` } });
  expect(reused.ok()).toBe(false);
  await page.goto('/');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(`${password}-reset`);
  await page.getByRole('button', { name: /Sign in/ }).click();
  await expect(page).toHaveURL(/\/workspace$/);
  const database = new Pool({ connectionString: process.env.DATABASE_URL });
  try { await database.query('DELETE FROM session WHERE "userId" = (SELECT id FROM "user" WHERE email=$1)', [email]); }
  finally { await database.end(); }
  await page.reload();
  await expect(page).toHaveURL(/expired=1/);
  expect(await page.request.get('/api/tasks').then(response => response.status())).toBe(401);
});

test('responsive Turkish, persistent dark theme, keyboard access, and no fake login', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('isLoggedIn', '1'));
  await page.goto('/workspace');
  await expect(page).toHaveURL(/expired=1/);
  await page.getByLabel('Language', { exact: true }).selectOption('tr');
  await expect(page.getByRole('heading', { name: 'Tekrar hoş geldin.' })).toBeVisible();
  await page.getByRole('button', { name: 'Koyu tema' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'İçeriğe geç' })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: `test-results/login-dark-${testInfo.project.name}.png`, fullPage: true });
});
