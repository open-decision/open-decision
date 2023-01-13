import {
  DecisionNodeModel,
  InfoNodeModel,
  NodeSidebarModel,
  PlaceholderNodeModel,
  pwTest,
} from "@open-decision/test-utils";
import { de } from "@open-decision/translations";
import { expect } from "@playwright/test";

pwTest("should be able to give name to node", async ({ editorPage }) => {
  const InfoNode = new InfoNodeModel(editorPage.page, "Willkommen");

  await editorPage.editor.selectNode("Willkommen");

  await InfoNode.sidebar.updateName("Nicht Willkommen");

  await expect(
    editorPage.editor.getSelectedNodeLocator("Nicht Willkommen")
  ).toBeVisible();
});

pwTest("should not be able to delete the startnode", async ({ editorPage }) => {
  const NodeSidebar = new NodeSidebarModel(
    editorPage.page,
    "info",
    "Willkommen"
  );

  await editorPage.editor.selectNode("Willkommen");

  await NodeSidebar.header.nodeMenu.open();

  await NodeSidebar.header.nodeMenu.locators.deleteOption.hover();

  await expect(
    editorPage.page.locator(
      `role=tooltip >> text=${de.builder.nodeEditingSidebar.menu.deleteNode.disabledForStartNodeLabel}`
    )
  ).toBeVisible();

  await NodeSidebar.header.nodeMenu.locators.deleteOption.click({
    force: true,
  });

  await expect(
    editorPage.editor.getSelectedNodeLocator("Willkommen")
  ).toBeVisible();
});

pwTest("should be able to reassign start node", async ({ editorPage }) => {
  const NodeSidebar = new NodeSidebarModel(
    editorPage.page,
    "info",
    "Info Angestellte"
  );

  await editorPage.editor.selectNode("Info Angestellte");

  await NodeSidebar.header.nodeMenu.makeStartNode();

  await expect(
    editorPage.editor.getNodeLabelLocator("Info Angestellte")
  ).toHaveText("Start");
});

pwTest.describe("final node", () => {
  pwTest(
    "should be able to mark node as final node",
    async ({ editorPage }) => {
      const NodeSidebar = new NodeSidebarModel(
        editorPage.page,
        "info",
        "Info Angestellte"
      );

      await editorPage.editor.selectNode("Info Angestellte");

      await NodeSidebar.header.nodeMenu.makeFinalNode();

      await expect(
        editorPage.editor.getNodeLabelLocator("Info Angestellte")
      ).toHaveText("Ende");
    }
  );

  pwTest(
    "should be able to remove final node label",
    async ({ editorPage }) => {
      const NodeSidebar = new NodeSidebarModel(
        editorPage.page,
        "info",
        "Info Angestellte"
      );

      await editorPage.editor.selectNode("Info Angestellte");

      await NodeSidebar.header.nodeMenu.makeFinalNode();

      await expect(
        editorPage.editor.getNodeLabelLocator("Info Angestellte")
      ).toHaveText("Ende");

      await NodeSidebar.header.nodeMenu.removeFinalNode();

      await expect(
        editorPage.editor.getNodeLabelLocator("Info Angestellte")
      ).not.toBeVisible();
    }
  );
});

pwTest.describe("should allow changing the node type", () => {
  pwTest("should be able to change node type", async ({ emptyEditorPage }) => {
    const PlaceholderNode = new PlaceholderNodeModel(emptyEditorPage.page);
    const DecisionNode = new DecisionNodeModel(
      emptyEditorPage.page,
      "Knoten 1"
    );
    const InfoNode = new InfoNodeModel(emptyEditorPage.page, "Knoten 1");

    // First we create our node
    await emptyEditorPage.editor.createNodeButton.click();

    // Then we implictly expect to have created a placeholder node and select the
    // decision options
    await PlaceholderNode.selectOption("decision");

    // Now we implictly expect to have a decision node sidebar open and change
    // its type to info
    await DecisionNode.sidebar.header.typeDropdown.changeType("info");

    await expect(
      InfoNode.sidebar.header.typeDropdown.locators.dropdown()
    ).toBeVisible();
  });

  pwTest(
    "should preserve content when the new type has it",
    async ({ editorPage }) => {
      const InfoNode = new InfoNodeModel(editorPage.page, "Info Angestellte");
      const DecisionNode = new DecisionNodeModel(
        editorPage.page,
        "Info Angestellte"
      );

      await editorPage.editor.selectNode("Info Angestellte");
      await InfoNode.sidebar.header.typeDropdown.changeType("decision");

      await expect(
        DecisionNode.sidebar.richTextEditor.locators.editor.getByText(
          "Voraussetzungen der CC Lizenzierung"
        )
      ).toBeVisible();
    }
  );
});
