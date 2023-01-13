import {
  DecisionNodeModel,
  InfoNodeModel,
  PlaceholderNodeModel,
  pwTest,
} from "@open-decision/test-utils";
import { expect } from "@playwright/test";

pwTest(
  "should be able to create decision node from placeholder node",
  async ({ emptyEditorPage }) => {
    const PlaceholderNode = new PlaceholderNodeModel(emptyEditorPage.page);
    const DecisionNode = new DecisionNodeModel(
      emptyEditorPage.page,
      "Knoten 1"
    );

    await emptyEditorPage.editor.createNodeButton.click();

    await PlaceholderNode.selectOption("decision");

    await expect(
      DecisionNode.sidebar.header.typeDropdown.locators.dropdown()
    ).toBeVisible();
  }
);

pwTest.describe("node editing sidebar", () => {
  pwTest(
    "should be able to edit content of node",
    async ({ emptyEditorPage }) => {
      await emptyEditorPage.editor.createNodeButton.click();

      const PlaceholderNode = new PlaceholderNodeModel(emptyEditorPage.page);

      await PlaceholderNode.selectOption("info");

      const InfoNode = new InfoNodeModel(emptyEditorPage.page, "Knoten 1");

      await InfoNode.sidebar.richTextEditor.fill("Hello World");

      await expect(
        InfoNode.sidebar.richTextEditor.locators.editor.getByText("Hello World")
      ).toBeVisible();
    }
  );

  pwTest("should be able to add answer option", async ({ editorPage }) => {
    const DecisionNode = new DecisionNodeModel(editorPage.page, "Willkommen");

    await editorPage.editor.selectNode("Verwendung Werke Dritter");

    await DecisionNode.sidebar.addAnswerOption("Neue Antwortmöglichkeit");

    await DecisionNode.sidebar.switchToTab("preview");

    await DecisionNode.renderer.scrollToInput("Einfachauswahl");
    await expect(
      DecisionNode.renderer.locators.input.option("Neue Antwortmöglichkeit")
    ).toBeVisible();
  });
});
