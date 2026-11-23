import type { Page } from '@playwright/test';

export class CheckboxesPage {
  get checkboxes() {
    return this.page.getByRole('checkbox');
  }

  constructor(private readonly page: Page) {}

  goto() {
    return this.page.goto('/checkboxes');
  }
}

export class DropdownPage {
  get dropdown() {
    return this.page.getByRole('combobox');
  }

  constructor(private readonly page: Page) {}

  goto() {
    return this.page.goto('/dropdown');
  }
}

export class UploadPage {
  // The file input has no label, and Dropzone adds a second hidden one, so target it by id.
  get fileInput() {
    return this.page.locator('#file-upload');
  }
  get submit() {
    return this.page.getByRole('button', { name: 'Upload' });
  }
  get heading() {
    return this.page.getByRole('heading', { name: 'File Uploaded!' });
  }
  get uploadedFiles() {
    return this.page.locator('#uploaded-files');
  }

  constructor(private readonly page: Page) {}

  goto() {
    return this.page.goto('/upload');
  }

  async upload(name: string, content: string) {
    await this.fileInput.setInputFiles({ name, mimeType: 'text/plain', buffer: Buffer.from(content) });
    await this.submit.click();
  }
}
