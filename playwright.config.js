import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://127.0.0.1:8765',
    channel: process.env.CI ? undefined : 'chrome',
  },
  webServer: {
    command: 'python3 -m http.server 8765 --bind 127.0.0.1 --directory site',
    url: 'http://127.0.0.1:8765',
    reuseExistingServer: !process.env.CI,
  },
});
