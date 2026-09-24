import { defineConfig, devices } from '@playwright/test';
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
export default defineConfig({
  testDir: './e2e', fullyParallel: false, workers: 1, retries: 0,
  timeout: 60000, expect: { timeout: 10000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:3100', trace: 'retain-on-failure', screenshot: 'only-on-failure',
    launchOptions: process.env.E2E_CHROME === '1' ? { channel: 'chrome' } : {} },
  projects: [{ name: 'desktop', use: { ...devices['Desktop Chrome'] } }, { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } }],
  webServer: { command: 'npm start', env: { HOSTNAME: '127.0.0.1', PORT: '3100' }, url: 'http://127.0.0.1:3100', reuseExistingServer: !process.env.CI, timeout: 60000 },
});
