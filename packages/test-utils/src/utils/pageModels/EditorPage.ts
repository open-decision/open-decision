import { Page } from "@playwright/test";
import { PartialTree } from "../../fixtures";
import { TreeFixture } from "../../fixtures/Tree";
import { TUser, UserFixture } from "../../fixtures/User";
import { EditorHeaderComponent } from "../componentModels/EditorHeaderComponent";
import { EditorComponent } from "../componentModels/Editor";
import { NotificationComponent } from "../componentModels/NotificationComponent";
import { proxiedPlaywrightOD } from "../playwright/APIClient";
import { TCreateTreeOutput } from "@open-decision/api-specification";

export type EditorPageContstructorParams = {
  page: Page;
  user: TUser;
  tree: TCreateTreeOutput | PartialTree;
  DataFixtures: { User: UserFixture; Tree: TreeFixture };
};

export class EditorPage {
  readonly page: Page;
  readonly user: TUser;
  readonly tree: TCreateTreeOutput | PartialTree;
  readonly header: EditorHeaderComponent;
  readonly editor: EditorComponent;
  readonly notification: NotificationComponent;
  readonly DataFixtures: { User: UserFixture; Tree: TreeFixture };

  constructor({
    DataFixtures,
    page,
    tree,
    user,
  }: EditorPageContstructorParams) {
    this.page = page;
    this.user = user;
    this.tree = tree;
    this.DataFixtures = DataFixtures;

    this.header = new EditorHeaderComponent(page, tree.name);
    this.editor = new EditorComponent(page);
    this.notification = new NotificationComponent(page);
  }

  async goto() {
    await this.page.goto(`/builder/${this.tree.uuid}`);
  }

  async cleanup() {
    await this.DataFixtures.Tree.cleanup();
    await this.DataFixtures.User.cleanup();
  }
}

export async function createEditorPage(
  page: Page,
  { emptyTree }: { emptyTree?: boolean } = { emptyTree: false }
) {
  const User = new UserFixture();
  const Tree = new TreeFixture(await proxiedPlaywrightOD(page.request));
  const user = await User.insert();

  await page.request.post(`/api/external-api/auth/login`, {
    data: { email: user.email, password: user.password },
  });

  const tree = await Tree.insert(user, { empty: emptyTree });

  return new EditorPage({ page, user, tree, DataFixtures: { User, Tree } });
}
