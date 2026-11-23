import { test, expect } from '@playwright/test';

// Harness check only: proves the-internet is up. Real E2E tests are written by hand.
test('the-internet loads @smoke', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Welcome to the-internet');
});
