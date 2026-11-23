import { test, expect } from '../../fixtures/pages';

test.describe('JavaScript alerts', () => {
  test.beforeEach(async ({ alertsPage }) => {
    await alertsPage.goto();
  });

  test('alert is shown and acknowledged', { tag: '@regression' }, async ({ alertsPage }) => {
    const dialog = await alertsPage.trigger('Alert', { accept: true });

    expect(dialog).toEqual({ type: 'alert', message: 'I am a JS Alert' });
    // "successfuly" is the app's own spelling.
    await expect(alertsPage.result).toHaveText('You successfuly clicked an alert');
  });

  test('confirm reports a dismissal as Cancel', { tag: '@regression' }, async ({ alertsPage }) => {
    const dialog = await alertsPage.trigger('Confirm', { accept: false });

    expect(dialog).toEqual({ type: 'confirm', message: 'I am a JS Confirm' });
    await expect(alertsPage.result).toHaveText('You clicked: Cancel');
  });

  test('prompt echoes the typed text', { tag: '@regression' }, async ({ alertsPage }) => {
    const dialog = await alertsPage.trigger('Prompt', { accept: true, text: 'hello from Playwright' });

    expect(dialog).toEqual({ type: 'prompt', message: 'I am a JS prompt' });
    await expect(alertsPage.result).toHaveText('You entered: hello from Playwright');
  });
});
