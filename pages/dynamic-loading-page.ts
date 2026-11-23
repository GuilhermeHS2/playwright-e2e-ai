import type { Page } from '@playwright/test';

export class DynamicLoadingPage {
  get start() {
    return this.page.getByRole('button', { name: 'Start' });
  }
  get loading() {
    return this.page.getByText('Loading...');
  }
  get result() {
    return this.page.getByRole('heading', { name: 'Hello World!' });
  }

  constructor(private readonly page: Page) {}

  goto(example: 1 | 2) {
    return this.page.goto(`/dynamic_loading/${example}`);
  }
}
