import { de } from "@open-decision/translations";
import { Page } from "@playwright/test";
import { NodeOptions } from "../shared";

export class TypeDropdownModel {
  readonly page: Page;
  readonly type: NodeOptions;

  constructor(page: Page, type: NodeOptions) {
    this.page = page;
    this.type = type;
  }

  get locators() {
    return {
      dropdown: () =>
        this.page.getByRole("button", {
          name: de.common.nodeNames[this.type].short,
        }),
      option: (newType: NodeOptions) =>
        this.page.getByRole("menuitem", {
          name: de.common.nodeNames[newType].short,
        }),
    };
  }

  async changeType(newType: NodeOptions) {
    await this.locators.dropdown().click();

    await this.locators.option(newType).click();
  }
}
