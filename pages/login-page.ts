import type { Page } from '@playwright/test';

export class LoginPage {
  get username() {
    return this.page.getByLabel('Username');
  }
  get password() {
    return this.page.getByLabel('Password');
  }
  get submit() {
    return this.page.getByRole('button', { name: 'Login' });
  }
  // The flash message has no role or label; its id is the only stable hook.
  get flash() {
    return this.page.locator('#flash');
  }

  constructor(private readonly page: Page) {}

  goto() {
    return this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.submit.click();
  }
}

export class SecureAreaPage {
  get heading() {
    return this.page.getByRole('heading', { name: 'Secure Area', exact: true });
  }
  get logout() {
    return this.page.getByRole('link', { name: 'Logout' });
  }
  get flash() {
    return this.page.locator('#flash');
  }

  constructor(private readonly page: Page) {}
}
