import { Locator, Page } from "@playwright/test";

export class RichTextEditorModel {
  readonly page: Page;
  readonly locators: {
    editor: Locator;
    label: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.locators = {
      editor: page.locator(`[data-test=richTextEditor] div`),
      label: page.locator(`label >> text=Inhalt`),
    };
  }

  async fill(text: string) {
    await this.locators.label.click();
    await this.page.waitForTimeout(100);
    await this.page.keyboard.type(text);
  }
}
