import { Page } from "@playwright/test";

export class MultiSelectRendererModel {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getAnswerLocator(text: string) {
    return this.page.locator(`label >> text=${text}`);
  }

  async selectAnswers(answerTexts: string[]) {
    for (const answer of answerTexts) {
      await this.getAnswerLocator(answer).click();
    }
  }
}
