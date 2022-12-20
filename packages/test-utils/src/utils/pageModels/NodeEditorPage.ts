import { Page } from "@playwright/test";
import { PartialTree } from "../../fixtures";
import { TreeFixture } from "../../fixtures/Tree";
import { TUser, UserFixture } from "../../fixtures/User";
import { EditorHeaderComponent } from "../componentModels/EditorHeaderComponent";
import { NodeEditorComponent } from "../componentModels/NodeEditor";
import { NotificationComponent } from "../componentModels/NotificationComponent";
import { proxiedPlaywrightOD } from "../playwright/odClient";

export class NodeEditorPage {
  readonly page: Page;
  readonly user: TUser;
  readonly tree: PartialTree;
  readonly header: EditorHeaderComponent;
  readonly editor: NodeEditorComponent;
  readonly notification: NotificationComponent;
  readonly dataFixtures: { User: UserFixture; Tree: TreeFixture };

  constructor(
    page: Page,
    user: TUser,
    tree: PartialTree,
    DataFixtures: { User: UserFixture; Tree: TreeFixture }
  ) {
    this.page = page;
    this.user = user;
    this.tree = tree;
    this.dataFixtures = DataFixtures;

    this.header = new EditorHeaderComponent(page, tree.name);
    this.editor = new NodeEditorComponent(page);
    this.notification = new NotificationComponent(page);
  }

  async goto(treeUuid: string) {
    await this.page.goto(`/builder/${treeUuid}`);
  }

  async cleanup() {
    await this.dataFixtures.Tree.cleanup();
    await this.dataFixtures.User.cleanup();
  }
}

export async function createNodeEditorPage(page: Page) {
  const User = new UserFixture();
  const Tree = new TreeFixture(await proxiedPlaywrightOD(page.request));
  const user = await User.insert();

  await page.request.post(`/api/external-api/auth/login`, {
    data: { email: user.email, password: user.password },
  });

  const tree = await Tree.insert(user);

  return new NodeEditorPage(page, user, tree, { User, Tree });
}
