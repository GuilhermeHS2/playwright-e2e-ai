import { test, expect } from '../../fixtures/pages';

// The page shows its result after a fixed 5 s setTimeout, longer than the default 5 s expect timeout.
const LOAD_TIMEOUT = 10_000;

for (const [example, title] of [
  [1, 'hidden element is revealed'],
  [2, 'element is rendered after loading'],
] as const) {
  test(`dynamic loading example ${example}: ${title}`, { tag: '@regression' }, async ({ dynamicLoadingPage }) => {
    await dynamicLoadingPage.goto(example);
    await expect(dynamicLoadingPage.result).toBeHidden();

    await dynamicLoadingPage.start.click();

    await expect(dynamicLoadingPage.loading).toBeVisible();
    await expect(dynamicLoadingPage.result).toBeVisible({ timeout: LOAD_TIMEOUT });
    await expect(dynamicLoadingPage.loading).toBeHidden();
  });
}
