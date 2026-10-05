import { defineConfig, devices } from '@playwright/test';

// End-to-end tests of the guide itself. `npm run test:e2e` builds the app and serves the production bundle
// (the Vite dev server can reload the page mid-test while it optimizes dependencies, which makes tests flaky).
export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    locale: 'es-ES',
    reducedMotion: 'reduce', // no smooth scrolling / animations moving elements under the cursor: deterministic clicks
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    cwd: '..',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
