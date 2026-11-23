import type { Page } from '@playwright/test';

export class TablesPage {
  // Example 1 is the first table on the page; neither table has a caption to name it by.
  get table() {
    return this.page.getByRole('table').first();
  }

  constructor(private readonly page: Page) {}

  goto() {
    return this.page.goto('/tables');
  }

  sortBy(column: string) {
    return this.table.getByRole('columnheader', { name: column }).click();
  }

  // Cells of one column, in the order they are rendered.
  async cells(column: string) {
    const headers = await this.table.getByRole('columnheader').allInnerTexts();
    const index = headers.findIndex((h) => h.trim() === column);
    return this.table.locator('tbody tr').locator(`td:nth-child(${index + 1})`);
  }
}
