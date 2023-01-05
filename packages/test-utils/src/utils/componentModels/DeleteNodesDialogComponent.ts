import { Locator, Page } from "@playwright/test";

export class DeleteNodesDialogComponent {
  readonly page: Page;
  readonly submitButton: Locator;
  readonly title: Locator;
  readonly dialog: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    this.page = page;

    this.submitButton = this.page.locator(
      `[role=dialog] >> button >> text=Löschen`
    );

    this.title = this.page.locator(
      `[role=dialog] >> text=Bist du sicher, dass du die Knoten löschen willst?`
    );
    this.dialog = this.page.locator(`[role="dialog"]`);
    this.error = this.page.locator("data-test=error-treeName");
  }

  async confirm() {
    await this.submitButton.click();
  }
}
