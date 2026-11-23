import { test, expect } from '../../fixtures/pages';

test('sortable table sorts by last name ascending, then descending', { tag: '@regression' }, async ({ tablesPage }) => {
  await tablesPage.goto();
  const lastNames = await tablesPage.cells('Last Name');
  const ascending = (await lastNames.allInnerTexts()).sort((a, b) => a.localeCompare(b));

  await tablesPage.sortBy('Last Name');
  await expect(lastNames).toHaveText(ascending);

  await tablesPage.sortBy('Last Name');
  await expect(lastNames).toHaveText([...ascending].reverse());
});
