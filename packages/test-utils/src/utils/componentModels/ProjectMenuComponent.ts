import { Locator, Page } from "@playwright/test";
import { de } from "@open-decision/translations";

export class ProjectMenuComponent {
  readonly page: Page;
  readonly title: string;
  readonly changeNameDialog: {
    title: Locator;
    option: Locator;
    submitButton: Locator;
    field: {
      input: Locator;
      error: Locator;
    };
  };
  readonly exportDialog: {
    title: Locator;
    option: Locator;
    customization: {
      submitButton: Locator;
      field: {
        input: Locator;
        error: Locator;
      };
    };
    save: {
      submitButton: Locator;
    };
  };

  readonly deleteDialog: {
    title: Locator;
    option: Locator;
    submitButton: Locator;
    field: {
      input: Locator;
      error: Locator;
    };
  };

  readonly publishMenu: {
    subMenuOption: Locator;
    option: Locator;
    openRenderer: Locator;
    copyLink: Locator;
  };

  constructor(page: Page, title: string) {
    this.page = page;
    this.title = title;

    this.changeNameDialog = {
      option: page.locator(`text=${de.common.projectMenu.changeName}`),
      title: page.locator(`text=${de.common.updateTreeDialog.title}`),
      submitButton: page.locator(
        `button >> text=${de.common.updateTreeDialog.submit}`
      ),
      field: {
        input: page.locator(
          `label >> text=${de.common.updateTreeDialog.treeNameInput.label}`
        ),
        error: page.locator(`data-test=error-treeName`),
      },
    };

    this.exportDialog = {
      title: page.locator(`text=${de.common.exportDialog.title}`),
      option: page.locator(`text=${de.common.projectMenu.export}`),

      customization: {
        submitButton: page.locator(
          `button >> text=${de.common.exportDialog.customization.submit}`
        ),
        field: {
          input: page.locator(
            `label >> text=${de.common.exportDialog.customization.nameInput.label}`
          ),
          error: page.locator(`data-test=error-name`),
        },
      },
      save: {
        submitButton: page.locator(
          `a >> text=${de.common.exportDialog.save.cta}`
        ),
      },
    };

    this.deleteDialog = {
      option: page.locator(`text=${de.common.projectMenu.delete}`),
      title: page.locator(`text=${de.common.deleteTreeDialog.title}`),
      submitButton: page.locator(
        `button >> text=${de.common.deleteTreeDialog.submit}`
      ),
      field: {
        input: page.locator(
          `label >> text=${de.common.deleteTreeDialog.treeNameInput.label}`
        ),
        error: page.locator(`data-test=error-treeName`),
      },
    };

    this.publishMenu = {
      subMenuOption: page.locator(
        `text=${de.common.projectMenu.publish.publish} >> nth=0`
      ),
      option: page.locator(
        `text=${de.common.projectMenu.publish.publish} >> nth=1`
      ),
      openRenderer: page.locator(`text=${de.common.projectMenu.publish.open}`),
      copyLink: page.locator(`text=${de.common.projectMenu.publish.copyLink}`),
    };
  }

  async goto() {
    await this.page.goto("/");
  }

  async open() {
    this.page.locator(`button >> text=${this.title}`).click();
  }

  async openPublishSubMenu() {
    await this.open();
    await this.publishMenu.subMenuOption.press("ArrowRight");
  }

  async publish() {
    await this.openPublishSubMenu();
    await this.publishMenu.option.click();
  }

  async openChangeNameDialog() {
    await this.open();
    await this.changeNameDialog.option.click();
  }

  async changeName(newTitle: string) {
    await this.openChangeNameDialog();
    await this.changeNameDialog.field.input.fill(newTitle);
    await this.changeNameDialog.submitButton.click();
  }

  async archive() {
    await this.open();
    await this.page.locator(`text=${de.common.projectMenu.archive}`).click();
  }

  async unarchive() {
    await this.open();
    await this.page.locator(`text=${de.common.projectMenu.unarchive}`).click();
  }

  async openDeleteDialog() {
    await this.open();
    await this.deleteDialog.option.click();
  }

  async delete() {
    await this.openDeleteDialog();
    await this.deleteDialog.field.input.fill(this.title);
    await this.deleteDialog.submitButton.click();
  }

  async export(fileName?: string) {
    await this.open();
    await this.exportDialog.option.click();
    await this.exportDialog.customization.field.input.fill(
      fileName ?? "Exportiertes Projekt"
    );

    await this.exportDialog.customization.submitButton.click();
    await this.exportDialog.save.submitButton.click();
  }
}
