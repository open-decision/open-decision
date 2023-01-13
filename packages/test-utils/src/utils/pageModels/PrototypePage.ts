import { de } from "@open-decision/translations";
import { expect, Page } from "@playwright/test";
import path from "path";
import { PartialTree } from "../../fixtures";
import { TreeFixture } from "../../fixtures/Tree";
import { TUser, UserFixture } from "../../fixtures/User";
import { NotificationComponent } from "../componentModels";
import { RendererComponent } from "../componentModels/RendererComponent";
import { proxiedPlaywrightOD } from "../playwright/APIClient";
import { DocumentNodeModel } from "../pluginModels";
import { EditorPage } from "./EditorPage";

export class PrototypePage {
  readonly page: Page;
  readonly user: TUser;
  readonly tree: PartialTree;
  readonly dataFixtures: { User: UserFixture; Tree: TreeFixture };

  renderer: RendererComponent;

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

    this.renderer = new RendererComponent(page);
  }

  async goto() {
    await this.page.goto(`/builder/${this.tree.uuid}/prototype`);
  }

  getErrorLocator(text: string) {
    return this.page.locator(`text=${text}`);
  }

  async cleanup() {
    await this.dataFixtures.Tree?.cleanup();
    await this.dataFixtures.User?.cleanup();
  }
}

export async function createPrototypePage(page: Page) {
  const User = new UserFixture();
  const Tree = new TreeFixture(await proxiedPlaywrightOD(page.request));
  const user = await User.insert();

  const treeToInsert = Tree.create({ hasPreview: true });
  const tree = await Tree.insert(user, { tree: treeToInsert });

  await page.request.post(`/api/external-api/auth/login`, {
    data: { email: user.email, password: user.password },
  });

  const editorPage = new EditorPage(page, user, tree, { User, Tree });

  await editorPage.goto();

  await editorPage.editor.selectNode("Vertrag generieren");

  const DocumentNode = new DocumentNodeModel(page);

  await DocumentNode.sidebar.uploadTemplate(
    path.join(__dirname, "../../files/auroa.docx")
  );

  const Notification = new NotificationComponent(page);

  await expect(
    Notification.getLocator(de.common.notifications.addTemplate.title)
  ).toBeVisible();

  return new PrototypePage(page, user, tree, {
    Tree,
    User,
  });
}
