import { Locator, Page } from "@playwright/test";
import { de } from "@open-decision/translations";

export class CreateProjectDialogComponent {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly submitButton: Locator;
  readonly title: Locator;
  readonly dialog: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = this.page.locator(
      `[role=dialog] >> label >> text=${de.common.createTreeDialog.treeNameInput.label}`
    );
    this.submitButton = this.page.locator(
      `[role=dialog] >> button >> text=Erstellen`
    );
    this.title = this.page.locator(
      `[role=dialog] >> text=${de.common.createTreeDialog.title}`
    );
    this.dialog = this.page.locator(`[role="dialog"]`);
    this.error = this.page.locator("data-test=error-treeName");
  }

  async createProject(name: string) {
    await this.nameInput.fill(name);

    await this.submitButton.click();
  }
}
