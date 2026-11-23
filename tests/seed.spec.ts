import { test } from '@playwright/test';

// Seed for the Playwright test agents (planner/generator): opens the app under test.
test('seed', async ({ page }) => {
  await page.goto('/');
});
