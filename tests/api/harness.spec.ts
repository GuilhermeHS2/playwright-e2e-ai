import { test, expect } from '@playwright/test';

// Harness check only: proves ServeRest is up. Real API tests are written by hand.
test('ServeRest responds @smoke', async ({ request }) => {
  const res = await request.get('/usuarios');
  expect(res.ok()).toBeTruthy();
});
