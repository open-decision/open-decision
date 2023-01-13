import { Page } from "@playwright/test";
import { RichTextEditorModel } from "../componentModels/RichTextEditorModel";
import { NodeSidebarModel } from "./NodeSidebarModel/NodeSidebarModel";

export class InfoNodeModel {
  readonly page: Page;
  readonly renderer: InfoNodeRendererModel;
  readonly sidebar: InfoNodeSidebarModel;

  constructor(page: Page, nodeName: string) {
    this.page = page;
    this.renderer = new InfoNodeRendererModel(page);
    this.sidebar = new InfoNodeSidebarModel(page, nodeName);
  }
}

class InfoNodeRendererModel {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}

class InfoNodeSidebarModel extends NodeSidebarModel {
  richTextEditor: RichTextEditorModel;

  constructor(page: Page, nodeName: string) {
    super(page, "info", nodeName);

    this.richTextEditor = new RichTextEditorModel(this.page);
  }
}
