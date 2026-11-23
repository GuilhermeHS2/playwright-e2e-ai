import { test, expect } from '../../fixtures/pages';

test.describe('Form authentication', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('valid credentials open the secure area, logout returns to login', { tag: '@smoke' }, async ({ page, loginPage, secureArea }) => {
    await loginPage.login('tomsmith', 'SuperSecretPassword!');

    await expect(page).toHaveURL(/\/secure$/);
    await expect(secureArea.heading).toBeVisible();
    await expect(secureArea.flash).toContainText('You logged into a secure area!');

    await secureArea.logout.click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.flash).toContainText('You logged out of the secure area!');
  });

  test('a wrong password shows an error and stays on login', { tag: '@regression' }, async ({ page, loginPage }) => {
    await loginPage.login('tomsmith', 'wrong-password');

    await expect(loginPage.flash).toContainText('Your password is invalid!');
    await expect(page).toHaveURL(/\/login$/);
  });
});
