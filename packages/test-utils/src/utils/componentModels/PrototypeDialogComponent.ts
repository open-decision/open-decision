import { de } from "@open-decision/translations";
import { Locator, Page } from "@playwright/test";

export class PrototypeDialogComponent {
  readonly button: Locator;
  readonly activeCheckbox: Locator;
  readonly openLink: Locator;

  constructor(page: Page) {
    this.button = page.locator(
      `button >> text=${de.builder.header.prototypeButton.button}`
    );
    this.activeCheckbox = page.locator(
      `text=${de.builder.header.prototypeButton.popover.checkbox}`
    );
    this.openLink = page.locator(
      `text=${de.builder.header.prototypeButton.popover.newTabLink}`
    );
  }

  async open() {
    await this.button.click();
  }

  async toggleCheckbox() {
    await this.activeCheckbox.click();
  }

  async openPrototype() {
    await this.openLink.click();
  }
}
