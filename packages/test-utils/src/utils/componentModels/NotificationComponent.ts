import { Page } from "@playwright/test";

export class NotificationComponent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getLocator(title: string) {
    return this.page.locator(`role=alert >> text=${title}`);
  }
}
