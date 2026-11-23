import type { Page } from '@playwright/test';

export type DialogInfo = { type: string; message: string };

export class AlertsPage {
  get result() {
    return this.page.locator('#result');
  }

  constructor(private readonly page: Page) {}

  goto() {
    return this.page.goto('/javascript_alerts');
  }

  // Clicks the button and answers the native dialog it opens. Returns what the dialog showed.
  async trigger(kind: 'Alert' | 'Confirm' | 'Prompt', answer: { accept: boolean; text?: string }) {
    const dialog = new Promise<DialogInfo>((resolve) => {
      this.page.once('dialog', async (d) => {
        resolve({ type: d.type(), message: d.message() });
        await (answer.accept ? d.accept(answer.text) : d.dismiss());
      });
    });
    await this.page.getByRole('button', { name: `Click for JS ${kind}` }).click();
    return dialog;
  }
}
