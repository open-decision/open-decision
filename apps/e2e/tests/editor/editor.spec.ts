import { expect } from "@playwright/test";
import { de } from "@open-decision/translations";
import { DashboardPage, RendererPage, pwTest } from "@open-decision/test-utils";

pwTest.describe.configure({ mode: "parallel" });

pwTest("should be able to create new node", async ({ emptyEditorPage }) => {
  await emptyEditorPage.editor.createNodeButton.click();

  await expect(emptyEditorPage.editor.getSidebarLocator()).toBeVisible();

  await expect(
    emptyEditorPage.editor.getSelectedNodeLocator("Knoten 1")
  ).toBeVisible();
});

pwTest.describe("node search", () => {
  pwTest(
    "should filter nodes by name based on search query",
    async ({ editorPage: nodeEditorPage }) => {
      await nodeEditorPage.header.nodeSearch.input.fill("Willkommen");

      await expect(
        nodeEditorPage.header.nodeSearch.getOptionLocator("Mangel")
      ).not.toBeVisible();

      await nodeEditorPage.header.nodeSearch.selectOption("Willkommen");

      await expect(nodeEditorPage.editor.getSidebarLocator()).toHaveValue(
        "Willkommen"
      );

      await expect(
        nodeEditorPage.editor.getSelectedNodeLocator("Willkommen")
      ).toBeVisible();
    }
  );

  pwTest(
    "should be able to create node with search queries name",
    async ({ editorPage: nodeEditorPage }) => {
      await nodeEditorPage.header.nodeSearch.input.fill(
        "Nicht existierender Knoten"
      );
      await nodeEditorPage.header.nodeSearch.selectOption(
        "Nicht existierender Knoten"
      );

      await expect(nodeEditorPage.editor.getSidebarLocator()).toHaveValue(
        "Nicht existierender Knoten"
      );

      await expect(
        nodeEditorPage.editor.getSelectedNodeLocator(
          "Nicht existierender Knoten"
        )
      ).toBeVisible();
    }
  );
});

pwTest.describe("canvas", () => {
  pwTest(
    "should be able to pan around",
    async ({ editorPage: nodeEditorPage }) => {
      await nodeEditorPage.editor.pan(1000, 1000);

      await expect(nodeEditorPage.editor.canvas).toHaveScreenshot();
    }
  );

  pwTest(
    "should be able to zoom in and out",
    async ({ editorPage: nodeEditorPage }) => {
      // zoom out with mouse wheel
      await nodeEditorPage.editor.zoom(5000);

      await expect(nodeEditorPage.editor.canvas).toHaveScreenshot();

      await nodeEditorPage.editor.zoom(-2500);

      await expect(nodeEditorPage.editor.canvas).toHaveScreenshot();

      // zoom out with buttons
      await nodeEditorPage.editor.zoomOutButton.click();

      await expect(nodeEditorPage.editor.canvas).toHaveScreenshot();

      // zoom in with buttons
      await nodeEditorPage.editor.zoomInButton.click();

      await expect(nodeEditorPage.editor.canvas).toHaveScreenshot();
    }
  );

  pwTest(
    "should be able to drag nodes around",
    async ({ editorPage: nodeEditorPage }) => {
      await nodeEditorPage.editor
        .getUnselectedNodeLocator("Willkommen")
        .dragTo(nodeEditorPage.editor.getUnselectedNodeLocator("Lizenzart"));

      await expect(nodeEditorPage.editor.canvas).toHaveScreenshot();
    }
  );

  pwTest(
    "should be able to delete node with the backspace key",
    async ({ editorPage: nodeEditorPage }) => {
      await nodeEditorPage.editor.selectNode("Info Angestellte");
      await nodeEditorPage.page.waitForTimeout(200);

      await nodeEditorPage.page.keyboard.press("Backspace");

      await nodeEditorPage.page.waitForTimeout(200);
      await nodeEditorPage.editor.deleteNodesDialog.confirm();

      await expect(
        nodeEditorPage.editor.getUnselectedNodeLocator("Info Angestellte")
      ).not.toBeVisible();

      await expect(
        nodeEditorPage.editor.getEdgeLocator(
          "95b1680c-dbd4-4a91-9975-5196702d9738_15a24be0-0b27-41a2-aa25-614a61dd1cbd_edge"
        )
      ).not.toBeVisible();
    }
  );

  pwTest("should not be able to delete start node", async ({ editorPage }) => {
    await editorPage.editor.selectNode("Willkommen");

    await editorPage.page.waitForTimeout(500);

    await editorPage.page.keyboard.press("Backspace");

    await expect(editorPage.editor.deleteNodesDialog.title).not.toBeVisible();

    await expect(
      editorPage.notification.getLocator(
        de.common.notifications.cannotDeleteStartNode.title
      )
    ).toBeVisible();
  });

  pwTest(
    "should be able to deselect a node",
    async ({ editorPage: nodeEditorPage }) => {
      await nodeEditorPage.editor.selectNode("Willkommen");

      await expect(
        nodeEditorPage.editor.getSelectedNodeLocator("Willkommen")
      ).toBeVisible();

      await nodeEditorPage.editor.canvas.click();

      await expect(
        nodeEditorPage.editor.getUnselectedNodeLocator("Willkommen")
      ).toBeVisible();
    }
  );

  pwTest.describe("multi select", () => {
    pwTest(
      "should be able to select multiple nodes at once",
      async ({ editorPage: nodeEditorPage }) => {
        pwTest.fixme();
      }
    );

    pwTest(
      "should be able to drag multi selected nodes together",
      async ({ editorPage: nodeEditorPage }) => {
        pwTest.fixme();
      }
    );

    pwTest(
      "should be able to delete multi selected nodes",
      async ({ editorPage: nodeEditorPage }) => {
        pwTest.fixme();
      }
    );
    pwTest(
      "should be able to deselect nodes",
      async ({ editorPage: nodeEditorPage }) => {
        pwTest.fixme();
      }
    );
  });
});

pwTest(
  "should be able to go back to Dashboard",
  async ({ editorPage: nodeEditorPage }) => {
    await Promise.all([
      nodeEditorPage.page.waitForNavigation(),
      nodeEditorPage.header.goHome(),
    ]);

    await expect(nodeEditorPage.page).toHaveURL("/");
  }
);

pwTest.describe("project menu", () => {
  pwTest(
    "should be able to change tree name",
    async ({ editorPage: nodeEditorPage }) => {
      await nodeEditorPage.header.projectMenuDropdown.changeName(
        "Neuer Baumname"
      );

      await expect(
        nodeEditorPage.notification.getLocator(
          de.common.notifications.updateProject.title
        )
      ).toBeVisible();

      await expect(
        nodeEditorPage.header.projectMenuDropdown.changeNameDialog.title
      ).not.toBeVisible();

      await expect(
        nodeEditorPage.page.locator(`text=Neuer Baumname`)
      ).toBeVisible();
    }
  );

  pwTest(
    "should be able to export tree",
    async ({ editorPage: nodeEditorPage }) => {
      const exportedFileName = "Export Name";

      const [download] = await Promise.all([
        // It is important to call waitForEvent before click to set up waiting.
        nodeEditorPage.page.waitForEvent("download"),
        // Triggers the download.
        await nodeEditorPage.header.projectMenuDropdown.export(
          exportedFileName
        ),
      ]);

      expect(download.suggestedFilename()).toBe(`${exportedFileName}.json`);
    }
  );

  pwTest(
    "should be able to delete tree",
    async ({ editorPage: nodeEditorPage }) => {
      await Promise.all([
        nodeEditorPage.page.waitForNavigation(),
        await nodeEditorPage.header.projectMenuDropdown.delete(),
        expect(
          nodeEditorPage.notification.getLocator(
            de.common.notifications.deleteProject.title
          )
        ).toBeVisible(),
      ]);

      const dashboardPage = new DashboardPage(
        nodeEditorPage.page,
        nodeEditorPage.user,
        { [nodeEditorPage.tree.uuid]: nodeEditorPage.tree },
        nodeEditorPage.dataFixtures
      );

      await expect(dashboardPage.page).toHaveURL("/");

      await expect(
        dashboardPage.getProjectCardLocator(nodeEditorPage.tree.name)
      ).not.toBeVisible();
    }
  );
});

pwTest(
  "should be able to navigate to renderer",
  async ({ editorPage: nodeEditorPage, context }) => {
    await nodeEditorPage.header.projectMenuDropdown.publish();
    await nodeEditorPage.header.projectMenuDropdown.openPublishSubMenu();

    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      nodeEditorPage.header.projectMenuDropdown.publishMenu.openRenderer.click(),
    ]);

    await newPage.waitForLoadState();

    await expect(newPage).toHaveURL(/\/public*/);
    await expect(newPage.locator("h1 >> text=AuROA")).toBeVisible();
  }
);

pwTest(
  "should be able to activate and deactivate the prototype",
  async ({ editorPage: nodeEditorPage, context }) => {
    // FIXME The api returns a 404 when the hasPreview flag is set to false
    pwTest.fixme();
    await nodeEditorPage.header.prototypeDialog.open();
    await nodeEditorPage.header.prototypeDialog.toggleCheckbox();

    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      nodeEditorPage.header.prototypeDialog.openPrototype(),
    ]);

    const prototypePage = new RendererPage(
      newPage,
      nodeEditorPage.user,
      nodeEditorPage.tree,
      nodeEditorPage.dataFixtures
    );

    await expect(prototypePage.page).toHaveURL(/\/*prototype/);
    await expect(prototypePage.page.locator("text=Willkommen")).toBeVisible();

    await nodeEditorPage.header.prototypeDialog.toggleCheckbox();

    await prototypePage.page.reload();
    await expect(prototypePage.page.locator("text=Willkommen")).toBeVisible();
  }
);
