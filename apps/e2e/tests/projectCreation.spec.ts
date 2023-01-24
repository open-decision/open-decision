import {
  DecisionNodeModel,
  EditorPage,
  PlaceholderNodeModel,
  pwTest,
} from "@open-decision/test-utils";
import { expect } from "@playwright/test";

pwTest(
  "should be able to open renderer of created tree",
  async ({ dashboardPage }) => {
    const newProjectName = "Neues Projekt";
    const nodeName = "Knoten 1";

    const createdTree = await dashboardPage.createProject(newProjectName);

    const editorPage = new EditorPage({ ...dashboardPage, tree: createdTree });

    await editorPage.editor.selectNode(nodeName);

    const PlaceholderNode = new PlaceholderNodeModel(editorPage.page);

    await PlaceholderNode.selectOption("decision");

    const DecisionNode = new DecisionNodeModel(editorPage.page, nodeName);

    await DecisionNode.sidebar.richTextEditor.fill("Hallo Welt!");

    await editorPage.header.prototypeDialog.openPrivatePreview();

    await expect(editorPage.page.getByText("Hallo Welt!")).toBeVisible();
  }
);
