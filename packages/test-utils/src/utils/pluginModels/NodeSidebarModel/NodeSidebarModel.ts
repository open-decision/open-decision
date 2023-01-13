import { de } from "@open-decision/translations";
import { Locator, Page } from "@playwright/test";
import { NodeOptions } from "../shared";
import { NodeMenuModel } from "./NodeMenuModel";
import { TypeDropdownModel } from "./TypeDropdownModel";

export class NodeSidebarModel {
  readonly page: Page;
  readonly header: {
    typeDropdown: TypeDropdownModel;
    nodeMenu: NodeMenuModel;
    locators: {
      nameInput: Locator;
    };
  };
  protected nodeName: string;

  constructor(page: Page, type: NodeOptions, nodeName: string) {
    this.page = page;
    this.nodeName = nodeName;
    this.header = {
      typeDropdown: new TypeDropdownModel(page, type),
      nodeMenu: new NodeMenuModel(page, this.nodeName),
      locators: {
        nameInput: page.locator(
          `label >> text=${de.builder.nodeEditingSidebar.nameInput.label}`
        ),
      },
    };
  }

  async updateName(newName: string) {
    this.nodeName = newName;
    await this.header.locators.nameInput.fill(newName);
  }
}
