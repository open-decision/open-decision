import { Page } from "@playwright/test";

export class GroupNodeModel {
  readonly page: Page;
  renderer: GroupNodeRenderer;
  sidebar: GroupNodeSidebar;

  constructor(page: Page) {
    this.page = page;
    this.renderer = new GroupNodeRenderer(page);
    this.sidebar = new GroupNodeSidebar(page);
  }
}

class GroupNodeRenderer {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getAddItemLocator(buttonText: string) {
    return this.page.locator(`button >> text=${buttonText}`);
  }

  async addItem(buttonText: string) {
    await this.getAddItemLocator(buttonText).click();
  }
}

class GroupNodeSidebar {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
