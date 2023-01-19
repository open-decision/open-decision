import { TCreatePublishedTreeOutput } from "@open-decision/api-specification";
import { Page } from "@playwright/test";
import { PartialTree } from "../../../fixtures";
import { TreeFixture } from "../../../fixtures/Tree";
import { TUser, UserFixture } from "../../../fixtures/User";
import { RendererComponent } from "../../componentModels/RendererComponent";

export class RendererPage {
  readonly page: Page;
  readonly user: TUser;
  readonly tree: PartialTree | TCreatePublishedTreeOutput;
  readonly dataFixtures: { User: UserFixture; Tree: TreeFixture };
  renderer: RendererComponent;

  constructor(
    page: Page,
    user: TUser,
    tree: PartialTree | TCreatePublishedTreeOutput,
    DataFixtures: { User: UserFixture; Tree: TreeFixture }
  ) {
    this.page = page;
    this.user = user;
    this.tree = tree;
    this.dataFixtures = DataFixtures;

    this.renderer = new RendererComponent(page);
  }

  getErrorLocator(text: string) {
    return this.page.locator(`text=${text}`);
  }

  async cleanup() {
    await this.dataFixtures.Tree?.cleanup();
    await this.dataFixtures.User?.cleanup();
  }
}
