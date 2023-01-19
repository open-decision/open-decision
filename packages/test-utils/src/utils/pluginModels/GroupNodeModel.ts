import { Locator, Page } from "@playwright/test";

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

  locators: {
    iterationTitle: (title: string) => Locator;
    iterationEditButton: (title: string) => Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.locators = {
      iterationTitle: (title: string) =>
        this.page.getByRole("heading", { name: title }),
      iterationEditButton: (title: string) =>
        this.page.getByRole("button", { name: `${title} bearbeiten` }),
    };
  }

  getAddItemLocator(buttonText: string) {
    return this.page.locator(`button >> text=${buttonText}`);
  }

  async editIteration(title: string) {
    await this.locators.iterationEditButton(title).click();
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
