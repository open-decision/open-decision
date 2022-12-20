import { expect } from "@playwright/test";
import { de } from "@open-decision/translations";
import {
  DashboardPage,
  PrototypePage,
  pwTest,
} from "@open-decision/test-utils";

pwTest.describe.configure({ mode: "parallel" });

pwTest("should be able to create new node", async ({ nodeEditorPage }) => {
  await nodeEditorPage.editor.createNodeButton.click();

  await expect(nodeEditorPage.editor.getSidebarLocator()).toBeVisible();

  await expect(
    nodeEditorPage.editor.getNodeLocator({
      selected: true,
    })
  ).toBeVisible();
});

pwTest.describe("node search", () => {
  pwTest(
    "should filter nodes by name based on search query",
    async ({ nodeEditorPage }) => {
      await nodeEditorPage.header.nodeSearch.input.fill("Willkommen");

      await expect(
        nodeEditorPage.header.nodeSearch.getOptionLocator("Mangel")
      ).not.toBeVisible();

      await nodeEditorPage.header.nodeSearch.selectOption("Willkommen");

      await expect(nodeEditorPage.editor.getSidebarLocator()).toHaveValue(
        "Willkommen"
      );

      await expect(
        nodeEditorPage.editor.getNodeLocator({
          content: "Willkommen",
          selected: true,
        })
      ).toBeVisible();
    }
  );

  pwTest(
    "should be able to create node with search queries name",
    async ({ nodeEditorPage }) => {
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
        nodeEditorPage.editor.getNodeLocator({
          content: "Nicht existierender Knoten",
          selected: true,
        })
      ).toBeVisible();
    }
  );
});

pwTest.describe("canvas", () => {
  pwTest("should be able to pan around", async ({ nodeEditorPage }) => {
    await nodeEditorPage.editor.pan(100, 100);

    await expect(nodeEditorPage.editor.canvas).toHaveScreenshot();
  });

  pwTest("should be able to zoom in and out", async ({ nodeEditorPage }) => {
    // zoom out with mouse wheel
    await nodeEditorPage.editor.zoom(500);

    await expect(nodeEditorPage.editor.canvas).toHaveScreenshot();

    await nodeEditorPage.editor.zoom(-500);

    await expect(nodeEditorPage.editor.canvas).toHaveScreenshot();

    // zoom out with buttons
    await nodeEditorPage.editor.zoomOutButton.click();

    await expect(nodeEditorPage.editor.canvas).toHaveScreenshot();

    // zoom in with buttons
    await nodeEditorPage.editor.zoomInButton.click();

    await expect(nodeEditorPage.editor.canvas).toHaveScreenshot();
  });

  pwTest("should be able to drag nodes around", async ({ nodeEditorPage }) => {
    await nodeEditorPage.editor
      .getNodeLocator({ content: "Willkommen", selected: false })
      .dragTo(
        nodeEditorPage.editor.getNodeLocator({
          content: "Lizenzart",
          selected: false,
        })
      );

    await expect(nodeEditorPage.editor.canvas).toHaveScreenshot();
  });

  pwTest(
    "should be able to delete node with the backspace key",
    async ({ nodeEditorPage }) => {
      await nodeEditorPage.editor.selectNode({
        content: "Willkommen",
        selected: false,
      });
      await nodeEditorPage.page.keyboard.press("Backspace");

      await expect(
        nodeEditorPage.editor.getNodeLocator({
          content: "Willkommen",
          selected: false,
        })
      ).not.toBeVisible();

      await expect(
        nodeEditorPage.editor.getEdgeLocator(
          "2ccf5f67-3149-4434-a5d6-51760b48fe2f_71b50b99-60fb-488f-a26d-a261b16292b5"
        )
      ).not.toBeVisible();
    }
  );

  pwTest(
    "should not be able to delete start node",
    async ({ nodeEditorPage }) => {
      // The start node concept is not correctly implemented yet
      pwTest.fixme();
    }
  );

  pwTest("should be able to deselect a node", async ({ nodeEditorPage }) => {
    await nodeEditorPage.editor.selectNode({
      content: "Willkommen",
      selected: false,
    });

    await expect(
      nodeEditorPage.editor.getNodeLocator({
        content: "Willkommen",
        selected: true,
      })
    ).toBeVisible();

    await nodeEditorPage.editor.canvas.click();

    await expect(
      nodeEditorPage.editor.getNodeLocator({
        content: "Willkommen",
        selected: false,
      })
    ).toBeVisible();
  });

  pwTest.describe("multi select", () => {
    pwTest(
      "should be able to select multiple nodes at once",
      async ({ nodeEditorPage }) => {
        pwTest.fixme();
      }
    );

    pwTest(
      "should be able to drag multi selected nodes together",
      async ({ nodeEditorPage }) => {
        pwTest.fixme();
      }
    );

    pwTest(
      "should be able to delete multi selected nodes",
      async ({ nodeEditorPage }) => {
        pwTest.fixme();
      }
    );
    pwTest("should be able to deselect nodes", async ({ nodeEditorPage }) => {
      pwTest.fixme();
    });
  });
});

pwTest("should be able to go back to Dashboard", async ({ nodeEditorPage }) => {
  await Promise.all([
    nodeEditorPage.page.waitForNavigation(),
    nodeEditorPage.header.goHome(),
  ]);

  await expect(nodeEditorPage.page).toHaveURL("/");
});

pwTest.describe("project menu", () => {
  pwTest("should be able to change tree name", async ({ nodeEditorPage }) => {
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
  });

  pwTest("should be able to export tree", async ({ nodeEditorPage }) => {
    const exportedFileName = "Export Name";

    const [download] = await Promise.all([
      // It is important to call waitForEvent before click to set up waiting.
      nodeEditorPage.page.waitForEvent("download"),
      // Triggers the download.
      await nodeEditorPage.header.projectMenuDropdown.export(exportedFileName),
    ]);

    expect(download.suggestedFilename()).toBe(`${exportedFileName}.json`);
  });

  pwTest("should be able to delete tree", async ({ nodeEditorPage }) => {
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
  });
});

pwTest(
  "should be able to navigate to renderer",
  async ({ nodeEditorPage, context }) => {
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
  async ({ nodeEditorPage, context }) => {
    // FIXME The api returns a 404 when the hasPreview flag is set to false
    pwTest.fixme();
    await nodeEditorPage.header.prototypeDialog.open();
    await nodeEditorPage.header.prototypeDialog.toggleCheckbox();

    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      nodeEditorPage.header.prototypeDialog.openPrototype(),
    ]);

    const prototypePage = new PrototypePage(newPage, nodeEditorPage.tree);

    await expect(prototypePage.page).toHaveURL(/\/*prototype/);
    await expect(prototypePage.page.locator("text=Willkommen")).toBeVisible();

    await nodeEditorPage.header.prototypeDialog.toggleCheckbox();

    await prototypePage.page.reload();
    await expect(
      prototypePage.getErrorLocator(de.common.errors.PREVIEW_NOT_ENABLED.long)
    ).toBeVisible();
  }
);
