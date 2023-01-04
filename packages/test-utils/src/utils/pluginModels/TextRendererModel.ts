import { Page } from "@playwright/test";

export class TextRendererModel {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getAnswerLocator(label: string) {
    return this.page.getByLabel(label);
  }

  async fillAnswer(label: string, content: string) {
    await this.getAnswerLocator(label).fill(content);
  }
}
