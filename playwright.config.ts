import { defineConfig, devices } from '@playwright/test';

const API_URL = 'http://localhost:3000';
const UI_URL = 'http://localhost:7080';

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['html', { open: 'never' }], ['json', { outputFile: 'results/report.json' }], ['github']]
    : [['html', { open: 'never' }], ['list']],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'api', testDir: 'tests/api', use: { baseURL: API_URL } },
    { name: 'chromium', testDir: 'tests/e2e', use: { ...devices['Desktop Chrome'], baseURL: UI_URL } },
    { name: 'firefox', testDir: 'tests/e2e', use: { ...devices['Desktop Firefox'], baseURL: UI_URL } },
    { name: 'webkit', testDir: 'tests/e2e', use: { ...devices['Desktop Safari'], baseURL: UI_URL } },
  ],
  webServer: [
    {
      command: 'npx serverest --porta 3000 --nodoc',
      url: `${API_URL}/usuarios`,
      reuseExistingServer: !process.env.CI,
    },
    {
      // --name lets a leftover container be removed with `docker rm -f the-internet`
      command: 'docker run --rm --name the-internet -p 7080:5000 gprestes/the-internet',
      url: UI_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      stderr: 'ignore', // access logs
    },
  ],
});
