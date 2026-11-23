import { test, expect } from '../../fixtures/pages';

test('checkboxes toggle independently', { tag: '@regression' }, async ({ checkboxesPage }) => {
  await checkboxesPage.goto();
  const [first, second] = [checkboxesPage.checkboxes.nth(0), checkboxesPage.checkboxes.nth(1)];
  await expect(first).not.toBeChecked();
  await expect(second).toBeChecked();

  await first.check();
  await second.uncheck();

  await expect(first).toBeChecked();
  await expect(second).not.toBeChecked();
});

test('dropdown selects an option', { tag: '@regression' }, async ({ dropdownPage }) => {
  await dropdownPage.goto();
  await expect(dropdownPage.dropdown).toHaveValue('');

  await dropdownPage.dropdown.selectOption({ label: 'Option 2' });

  await expect(dropdownPage.dropdown).toHaveValue('2');
});

test('file upload shows the uploaded file name', { tag: '@smoke' }, async ({ uploadPage }) => {
  await uploadPage.goto();

  await uploadPage.upload('playwright-upload.txt', 'uploaded by the Playwright suite');

  await expect(uploadPage.heading).toBeVisible();
  await expect(uploadPage.uploadedFiles).toHaveText('playwright-upload.txt');
});
