import { Locator, Page } from "@playwright/test";

export class RendererComponent {
  page: Page;
  submitButton: Locator;
  richTextRenderer: Locator;
  goBackButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.submitButton = page.locator("button[type=submit]");
    this.richTextRenderer = page.locator("data-test=richTextEditor");
    this.goBackButton = page.locator("button >> text=Zurück");
  }
}
