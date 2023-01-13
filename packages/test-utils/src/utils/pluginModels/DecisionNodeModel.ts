import { Locator, Page } from "@playwright/test";
import { RichTextEditorModel } from "../componentModels/RichTextEditorModel";
import { NodeSidebarModel } from "./NodeSidebarModel/NodeSidebarModel";

export class DecisionNodeModel {
  readonly page: Page;
  readonly renderer: DecisionNodeRendererModel;
  readonly sidebar: DecisionNodeSidebarModel;

  constructor(page: Page, nodeName: string) {
    this.page = page;
    this.renderer = new DecisionNodeRendererModel(page);
    this.sidebar = new DecisionNodeSidebarModel(page, nodeName);
  }
}

class DecisionNodeRendererModel {
  readonly page: Page;
  readonly locators: {
    input: {
      label: (text: string) => Locator;
      option: (text: string) => Locator;
    };
  };

  constructor(page: Page) {
    this.page = page;
    this.locators = {
      input: {
        label: (text: string) => page.locator(`span >> text=${text}`),
        option: (text: string) => page.locator(`label >> text=${text}`),
      },
    };
  }

  async scrollToInput(labelText: string) {
    await this.locators.input.label(labelText).scrollIntoViewIfNeeded();
  }
}

class DecisionNodeSidebarModel extends NodeSidebarModel {
  readonly richTextEditor: RichTextEditorModel;
  readonly locators: {
    tabs: {
      content: Locator;
      paths: Locator;
      preview: Locator;
    };
    input: {
      addOptionButton: Locator;
      input: (number: number) => Locator;
    };
  };

  constructor(page: Page, nodeName: string) {
    super(page, "decision", nodeName);

    this.richTextEditor = new RichTextEditorModel(page);
    this.locators = {
      tabs: {
        content: page.locator("text=Inhalt"),
        paths: page.locator("text=Pfade"),
        preview: page.locator("text=Vorschau"),
      },
      input: {
        addOptionButton: page.locator("text=Neue Antwortmöglichkeit"),
        input: (number: number) =>
          page.getByRole("textbox", { name: `Antwortoption ${number}` }),
      },
    };
  }

  async switchToTab(tab: keyof typeof this.locators.tabs) {
    await this.locators.tabs[tab].click();
  }

  async addAnswerOption(optionText: string) {
    await this.locators.input.addOptionButton.click();
    await this.locators.input.input(3).fill(optionText);
  }
}
