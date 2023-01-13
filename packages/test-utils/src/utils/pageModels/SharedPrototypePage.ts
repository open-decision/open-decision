import { de } from "@open-decision/translations";
import { BrowserContext, expect, Page } from "@playwright/test";
import path from "path";
import { TreeFixture } from "../../fixtures/Tree";
import { UserFixture } from "../../fixtures/User";
import { NotificationComponent } from "../componentModels";
import { proxiedPlaywrightOD } from "../playwright/APIClient";
import { DocumentNodeModel } from "../pluginModels";
import { EditorPage } from "./EditorPage";
import { PrototypePage } from "./PrototypePage";

export class SharedPrototypePage extends PrototypePage {
  override async goto() {
    await this.page.goto(`/shared/prototype/${this.tree.uuid}`);
  }
}

export async function createSharedPrototypePage(
  page: Page,
  context: BrowserContext
) {
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

  await context.clearCookies();

  return new SharedPrototypePage(page, user, tree, {
    Tree,
    User,
  });
}
