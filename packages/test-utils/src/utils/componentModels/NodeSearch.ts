import { de } from "@open-decision/translations";
import { Locator, Page } from "@playwright/test";

export class NodeSearch {
  readonly page: Page;
  readonly input: Locator;

  constructor(page: Page) {
    this.page = page;
    this.input = page.locator(
      `[placeholder="${de.builder.nodeSearch.placeholder}"]`
    );
  }

  getOptionLocator(text: string) {
    return this.page.locator(`role=option >> text=${text}`);
  }

  async selectOption(text: string) {
    this.getOptionLocator(text).click();
  }
}
