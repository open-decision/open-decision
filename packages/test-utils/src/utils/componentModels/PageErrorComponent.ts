import { Locator, Page } from "@playwright/test";

export class PageErrorComponent {
  readonly page: Page;
  readonly locators: {
    title: (text: string) => Locator;
    description: (text: string) => Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.locators = {
      title: (text: string) => this.page.getByRole("heading", { name: text }),
      description: (text: string) => this.page.getByText(text),
    };
  }
}
