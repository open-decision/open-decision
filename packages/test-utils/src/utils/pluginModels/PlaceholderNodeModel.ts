import { de } from "@open-decision/translations";
import { Page } from "@playwright/test";
import { NodeOptions } from "./shared";

export class PlaceholderNodeModel {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getOptionLocator(option: NodeOptions) {
    return this.page.getByRole("button", {
      name: `Erstelle ${de.common.nodeNames[option].long}`,
    });
  }

  async selectOption(option: NodeOptions) {
    await this.getOptionLocator(option).click();
  }
}
