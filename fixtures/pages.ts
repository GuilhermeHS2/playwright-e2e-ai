import { test as base, expect } from '@playwright/test';
import { AlertsPage } from '../pages/alerts-page';
import { DynamicLoadingPage } from '../pages/dynamic-loading-page';
import { CheckboxesPage, DropdownPage, UploadPage } from '../pages/form-controls-page';
import { LoginPage, SecureAreaPage } from '../pages/login-page';
import { TablesPage } from '../pages/tables-page';

type Pages = {
  loginPage: LoginPage;
  secureArea: SecureAreaPage;
  checkboxesPage: CheckboxesPage;
  dropdownPage: DropdownPage;
  uploadPage: UploadPage;
  alertsPage: AlertsPage;
  dynamicLoadingPage: DynamicLoadingPage;
  tablesPage: TablesPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  secureArea: async ({ page }, use) => use(new SecureAreaPage(page)),
  checkboxesPage: async ({ page }, use) => use(new CheckboxesPage(page)),
  dropdownPage: async ({ page }, use) => use(new DropdownPage(page)),
  uploadPage: async ({ page }, use) => use(new UploadPage(page)),
  alertsPage: async ({ page }, use) => use(new AlertsPage(page)),
  dynamicLoadingPage: async ({ page }, use) => use(new DynamicLoadingPage(page)),
  tablesPage: async ({ page }, use) => use(new TablesPage(page)),
});

export { expect };
