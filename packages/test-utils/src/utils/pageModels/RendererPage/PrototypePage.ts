import { de } from "@open-decision/translations";
import { Page, expect } from "@playwright/test";
import path from "path";
import { TreeFixture } from "../../../fixtures/Tree";
import { UserFixture } from "../../../fixtures/User";
import { NotificationComponent } from "../../componentModels";
import { proxiedPlaywrightOD } from "../../playwright/APIClient";
import { DocumentNodeModel } from "../../pluginModels";
import { EditorPage } from "../EditorPage";
import { RendererPage } from "./RendererPage";

export class PrototypePage extends RendererPage {
  async goto() {
    await this.page.goto(`/builder/${this.tree.uuid}/prototype`);
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

  const editorPage = new EditorPage({
    page,
    user,
    tree,
    DataFixtures: { User, Tree },
  });

  await editorPage.goto();

  await editorPage.editor.selectNode("Vertrag generieren");

  const DocumentNode = new DocumentNodeModel(page);

  await DocumentNode.sidebar.uploadTemplate(
    path.join(__dirname, "../../../files/auroa.docx")
  );

  const Notification = new NotificationComponent(page);

  await expect(
    Notification.getLocator(de.common.notifications.addTemplate.title)
  ).toBeVisible();

  return new PrototypePage({
    page,
    user,
    tree,
    DataFixtures: {
      Tree,
      User,
    },
  });
}
