import { Locator, Page } from "@playwright/test";
import { de } from "@open-decision/translations";

export class HeaderComponent {
  readonly page: Page;
  readonly header: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator(`header`);
  }

  async goHome() {
    await this.page
      .locator(`header >> a >> text=${de.common.header.homeButtonHiddenLabel}`)
      .click();
  }
}
