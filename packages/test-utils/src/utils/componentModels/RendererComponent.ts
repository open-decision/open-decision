import { Locator, Page } from "@playwright/test";
import { MultiSelectRendererModel } from "../pluginModels/MultiSelectRendererModel";
import { SingleSelectRendererModel } from "../pluginModels/SingleSelectRendererModel";
import { TextRendererModel } from "../pluginModels/TextRendererModel";

export class RendererComponent {
  page: Page;
  submitButton: Locator;
  richTextRenderer: Locator;
  goBackButton: Locator;

  SingleSelectRenderer: SingleSelectRendererModel;
  TextRenderer: TextRendererModel;
  MultiSelectRenderer: MultiSelectRendererModel;

  constructor(page: Page) {
    this.page = page;
    this.submitButton = page.locator("button[type=submit]");
    this.richTextRenderer = page.locator("data-test=richTextEditor");
    this.goBackButton = page.locator("button >> text=Zurück");

    this.SingleSelectRenderer = new SingleSelectRendererModel(page);
    this.TextRenderer = new TextRendererModel(page);
    this.MultiSelectRenderer = new MultiSelectRendererModel(page);
  }
}
