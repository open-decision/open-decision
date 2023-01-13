import { de } from "@open-decision/translations";
import { Locator, Page } from "@playwright/test";
import { translate } from "../../internationalize";

export class NodeMenuModel {
  readonly page: Page;
  readonly locators: {
    menuButton: Locator;
    deleteOption: Locator;
    startNodeOption: Locator;
    finalNodeOption: {
      add: Locator;
      remove: Locator;
    };
  };
  readonly nodeName: string;

  constructor(page: Page, nodeName: string) {
    this.page = page;
    this.nodeName = nodeName;

    this.locators = {
      menuButton: page.locator(
        `text=${translate(de.builder.nodeEditingSidebar.menu.iconLabel)({
          name: this.nodeName,
        })}`
      ),
      deleteOption: page.locator(
        `text=${de.builder.nodeEditingSidebar.menu.deleteNode.label}`
      ),
      startNodeOption: page.locator(
        `text=${de.builder.nodeEditingSidebar.menu.makeStartNode.label}`
      ),
      finalNodeOption: {
        add: page.locator(
          `text=${de.builder.nodeEditingSidebar.menu.endNode.add.label}`
        ),
        remove: page.locator(
          `text=${de.builder.nodeEditingSidebar.menu.endNode.remove.label}`
        ),
      },
    };
  }

  async open() {
    await this.locators.menuButton.click();
  }

  async deleteNode() {
    await this.open();
    await this.locators.deleteOption.click();
  }

  async makeStartNode() {
    await this.open();
    await this.locators.startNodeOption.click();
  }

  async makeFinalNode() {
    await this.open();
    await this.locators.finalNodeOption.add.click();
  }

  async removeFinalNode() {
    await this.open();
    await this.locators.finalNodeOption.remove.click();
  }
}
