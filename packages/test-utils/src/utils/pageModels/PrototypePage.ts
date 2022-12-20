import { Page } from "@playwright/test";
import { PartialTree } from "../../fixtures";
import { TreeFixture } from "../../fixtures/Tree";
import { UserFixture } from "../../fixtures/User";
import { proxiedPlaywrightOD } from "../playwright/odClient";

export class PrototypePage {
  readonly page: Page;
  readonly tree: PartialTree;
  private TreeClass?: TreeFixture;
  private UserClass?: UserFixture;

  constructor(
    page: Page,
    tree: PartialTree,
    DataFixtures?: { TreeClass: TreeFixture; UserClass: UserFixture }
  ) {
    this.page = page;
    this.tree = tree;
    this.TreeClass = DataFixtures?.TreeClass;
    this.UserClass = DataFixtures?.UserClass;
  }

  async goto() {
    await this.page.goto(`/prototype/${this.tree.uuid}`);
  }

  getErrorLocator(text: string) {
    return this.page.locator(`text=${text}`);
  }

  async cleanup() {
    await this.TreeClass?.cleanup();
    await this.UserClass?.cleanup();
  }
}

export async function createPrototypePage(page: Page) {
  const UserClass = new UserFixture();
  const TreeClass = new TreeFixture(await proxiedPlaywrightOD(page.request));
  const user = await UserClass.insert();

  const tree = await TreeClass.insert(user);

  return new PrototypePage(page, tree, { TreeClass, UserClass });
}
