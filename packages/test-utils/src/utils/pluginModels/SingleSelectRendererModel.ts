import { Page } from "@playwright/test";

export class SingleSelectRendererModel {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getAnswerLocator(text: string) {
    return this.page.locator(`label >> text=${text}`);
  }

  async selectAnswer(text: string) {
    await this.getAnswerLocator(text).click();
  }
}
