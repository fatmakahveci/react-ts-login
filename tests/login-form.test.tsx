import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import LoginForm from '@/components/auth/login-form';
import { PreferencesProvider } from '@/contexts/preferences-context';
const mocks = vi.hoisted(() => ({ signIn: vi.fn(), push: vi.fn(), refresh: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mocks.push, refresh: mocks.refresh }), useSearchParams: () => new URLSearchParams() }));
vi.mock('@/lib/auth-client', () => ({ authClient: { signIn: { email: mocks.signIn } } }));
beforeEach(() => { vi.resetAllMocks(); });
afterEach(cleanup);
function start(locale: 'en' | 'tr' = 'en') { render(<PreferencesProvider initialLocale={locale} initialTheme="light"><LoginForm /></PreferencesProvider>); }
it('focuses the first invalid field and exposes accessible errors', () => {
  start(); fireEvent.click(screen.getByRole('button', { name: /Sign in/ }));
  expect(document.activeElement).toBe(screen.getByLabelText('Email address'));
  expect(screen.getByLabelText('Email address').getAttribute('aria-invalid')).toBe('true');
  expect(mocks.signIn).not.toHaveBeenCalled();
});
it('shows loading state, prevents duplicate submission, and handles rejected credentials', async () => {
  let resolve: (value: unknown) => void = () => {};
  mocks.signIn.mockReturnValue(new Promise(result => { resolve = result; }));
  start(); fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'demo@example.test' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong-password' } });
  fireEvent.click(screen.getByRole('button', { name: /Sign in/ }));
  expect(screen.getByRole('button', { name: /Please wait/ }).hasAttribute('disabled')).toBe(true);
  resolve({ error: { code: 'INVALID_EMAIL_OR_PASSWORD', status: 401 } });
  await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('email or password is incorrect'));
  expect(mocks.push).not.toHaveBeenCalled();
});
it('redirects only after server-confirmed sign-in', async () => {
  mocks.signIn.mockResolvedValue({ data: { user: {} } }); start();
  fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'demo@example.test' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'valid-passphrase' } });
  fireEvent.click(screen.getByRole('button', { name: /Sign in/ }));
  await waitFor(() => expect(mocks.push).toHaveBeenCalledWith('/workspace'));
});
it('reports network failure without redirecting', async () => {
  mocks.signIn.mockRejectedValue(new Error('network')); start();
  fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'demo@example.test' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'valid-passphrase' } });
  fireEvent.click(screen.getByRole('button', { name: /Sign in/ }));
  await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('Unable to connect'));
});
it('renders Turkish and toggles password visibility without submission', () => {
  start('tr'); fireEvent.click(screen.getByRole('button', { name: 'Parolayı göster' }));
  expect(screen.getByLabelText('Parola').getAttribute('type')).toBe('text');
  expect(screen.getByRole('button', { name: 'Parolayı gizle' }).getAttribute('aria-pressed')).toBe('true');
  expect(mocks.signIn).not.toHaveBeenCalled();
});
