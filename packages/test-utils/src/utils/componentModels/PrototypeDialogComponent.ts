import { de } from "@open-decision/translations";
import { Locator, Page } from "@playwright/test";

export class PreviewDialogComponent {
  readonly button: Locator;
  readonly activeCheckbox: Locator;
  readonly privateLink: Locator;
  readonly sharedLinkCopyButton: Locator;
  readonly openSharedLink: Locator;

  constructor(page: Page) {
    this.button = page.locator(
      `button >> text=${de.builder.header.preview.button}`
    );

    this.activeCheckbox = page.locator(
      `text=${de.builder.header.preview.popover.checkbox}`
    );

    this.privateLink = page.getByRole("link", {
      name: de.builder.header.preview.previewLink.hiddenLabel,
    });

    this.sharedLinkCopyButton = page.locator(
      `text=${de.builder.header.preview.popover.copyLinkButton}.enabled`
    );

    this.openSharedLink = page.getByRole("link", {
      name: de.builder.header.preview.popover.openSharedPreviewButton,
    });
  }

  async open() {
    await this.button.click();
  }

  async activateSharedPreview() {
    await this.activeCheckbox.click();
  }

  async deactivateSharedPreview() {
    await this.activeCheckbox.click();
  }

  async openPrivatePreview() {
    await this.privateLink.click();
  }

  async openSharedPreview() {
    await this.openSharedLink.click();
  }
}
