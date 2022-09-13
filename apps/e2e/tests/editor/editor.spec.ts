import { getFromEnv } from "@open-decision/test-utils";
import { test, expect, Page } from "@playwright/test";
import { de } from "@open-decision/translations";
import { t } from "../../utils/internationalize";
import { withUniqueUser } from "../../utils/szenarios/withUniqueUser";
import { WithTrees, withTrees } from "../../utils/szenarios/withTrees";
import {
  openProjectMenu,
  openPublishedTreeAction,
  openPublishSubMenu,
  publishTreeAction,
} from "../../utils/locators/projectMenu";
import {
  openPreviewPage,
  openPreviewPopover,
  togglePreviewCheckbox,
} from "../../utils/locators/previewPopover";

const generateNodeLocator = (content?: string, selected = true) =>
  `[aria-label="${t(de.builder.canvas.questionNode.empty.hiddenLabel)({
    content: (content?.length ?? 0) > 0,
    name: content,
    selected,
  })}"]`;

const locateNode = (page: Page, content?: string, selected?: boolean) =>
  page.locator(generateNodeLocator(content, selected));

const expectSelectedNodeToBeVisible = async (page: Page, content?: string) => {
  // ------------------------------------------------------------------
  // FIXME - React flow has an issue with fitView resulting in the tree not being shown in
  // the center every time.
  await page
    .locator(
      `role=button[name="${de.builder.canvas.zoomInAndOut.fitView.hiddenLabel}"]`
    )
    .click();

  await page.waitForTimeout(2000);
  // ------------------------------------------------------------------

  await expect(
    page.locator(
      `aside >> text=${de.builder.nodeEditingSidebar.nameInput.label}`
    )
  ).toBeVisible();

  await expect(locateNode(page, content, true)).toBeVisible();
};

withUniqueUser("editor");
withTrees();

// eslint-disable-next-line no-empty-pattern
test.beforeEach(async ({}, testInfo) => {
  testInfo.snapshotSuffix = "";
});

test("should be able to open a tree", async ({ page }) => {
  const trees = getFromEnv<WithTrees>("trees");
  await page.goto("/");
  await page.locator(`h2 >> text=${trees.activeTree.name}`).click();

  await expect(page).toHaveURL(/builder\/*/);
});

test.beforeEach(async ({ page }) => {
  const trees = getFromEnv<WithTrees>("trees");

  await page.goto(`/builder/${trees.activeTree.uuid}`);
  await page.waitForSelector(
    generateNodeLocator("Wirksamer Mietvertrag", false)
  );
});

test("should be able to create new node", async ({ page }) => {
  await page
    .locator(`role=button[name="${de.builder.createNodeButton.hiddenLabel}"]`)
    .click();

  await expectSelectedNodeToBeVisible(page);
});

test.describe("node search", () => {
  test("should filter nodes by name based on search query", async ({
    page,
  }) => {
    await page
      .locator(`[placeholder="${de.builder.nodeSearch.placeholder}"]`)
      .type("Wirksamer Mietvertrag");

    await expect(page.locator(`role=option >> text=Mangel`)).not.toBeVisible();
    await page.locator(`role=option >> text=Wirksamer Mietvertrag`).click();

    await expectSelectedNodeToBeVisible(page, "Wirksamer Mietvertrag");
  });

  test("should be able to create node with search queries name", async ({
    page,
  }) => {
    await page.waitForTimeout(100);
    await page
      .locator(`[placeholder="${de.builder.nodeSearch.placeholder}"]`)
      .fill("nicht existierender Knoten");

    await page
      .locator(`role=option >> text=nicht existierender Knoten`)
      .click();

    await expectSelectedNodeToBeVisible(page, "nicht existierender Knoten");
  });
});

test.describe("canvas", () => {
  test("should be able to pan around", async ({ page }) => {
    await page.mouse.move(200, 200);
    await page.mouse.down();
    await page.mouse.move(500, 500);
    await page.mouse.up();

    await expect(page.locator("data-test=canvas")).toHaveScreenshot();
  });

  test("should be able to zoom in and out", async ({ page }) => {
    // zoom out with mouse wheel
    await page.mouse.move(200, 200);
    await page.keyboard.down("Control");
    await page.mouse.wheel(0, 500);
    await page.keyboard.up("Control");

    await expect(page.locator("data-test=canvas")).toHaveScreenshot();

    // zoom in with mouse wheel
    await page.keyboard.down("Control");
    await page.mouse.wheel(0, -500);
    await page.keyboard.up("Control");

    await expect(page.locator("data-test=canvas")).toHaveScreenshot();

    // zoom out with buttons
    await page
      .locator(
        `role=button[name="${de.builder.canvas.zoomInAndOut.zoomOut.hiddenLabel}"]`
      )
      .click();

    await expect(page.locator("data-test=canvas")).toHaveScreenshot();

    // zoom in with buttons
    await page
      .locator(
        `role=button[name="${de.builder.canvas.zoomInAndOut.zoomIn.hiddenLabel}"]`
      )
      .click();

    await expect(page.locator("data-test=canvas")).toHaveScreenshot();
  });

  test("should be able to drag nodes around", async ({ page }) => {
    await page
      .locator(`text=Wirksamer Mietvertrag`)
      .dragTo(page.locator(`text=Sachmangel`));

    await expect(page.locator("data-test=canvas")).toHaveScreenshot();
  });

  test("should be able to connect two nodes", async ({ page }) => {
    await page.waitForTimeout(100);
    await page
      .locator(`role=button[name="${de.builder.createNodeButton.hiddenLabel}"]`)
      .click();

    await page.waitForSelector(
      `[aria-label="${t(de.builder.canvas.questionNode.empty.hiddenLabel)({
        content: false,
        name: "",
        selected: true,
      })}"]`
    );

    await page
      .locator(`data-test=2ccf5f67-3149-4434-a5d6-51760b48fe2f-source-port`)
      .dragTo(locateNode(page));

    await expect(page.locator("data-test=canvas")).toHaveScreenshot();
  });

  test("should be able to delete node", async ({ page }) => {
    await locateNode(page, "Wirksamer Mietvertrag", false).click();
    await page.keyboard.press("Backspace");

    await expect(
      page.locator(`data-test=questionNode`, {
        hasText: "Wirksamer Mietvertrag",
      })
    ).not.toBeVisible();
    await expect(
      page.locator(
        `data-test=2ccf5f67-3149-4434-a5d6-51760b48fe2f_71b50b99-60fb-488f-a26d-a261b16292b5_edge`
      )
    ).not.toBeVisible();
  });

  test("should not be able to delete start node", async ({ page }) => {
    // Currently no alert is shown when trying to delete the start node
    test.fixme();
    await page.locator(`text=eine Frage`).click();
    await page.keyboard.press("Backspace");

    await expect(page.locator(`role=alert`)).toBeVisible();
  });

  test("should be able to deselect a node", async ({ page }) => {
    await locateNode(page, "Wirksamer Mietvertrag", false).click();

    await expect(locateNode(page, "Wirksamer Mietvertrag")).toBeVisible();

    await page.locator(`data-test=canvas`).click();

    await expect(locateNode(page, "Wirksamer Mietvertrag")).not.toBeVisible();
    await expect(
      locateNode(page, "Wirksamer Mietvertrag", false)
    ).toBeVisible();
  });

  test.describe("multi select", () => {
    test("should be able to select multiple nodes at once", async ({
      page,
    }) => {
      //expect sidebar not to open
      test.fixme();
    });

    test("should be able to drag multi selected nodes together", async ({
      page,
    }) => {
      test.fixme();
    });

    test("should be able to delete multi selected nodes", async ({ page }) => {
      //expect startnode not to be deleted
      test.fixme();
    });
    test("should be able to deselect nodes", async ({ page }) => {
      test.fixme();
    });
  });
});

test.describe("node editing sidebar", () => {
  test("should be able to give name to node", async ({ page }) => {
    await locateNode(page, "Wirksamer Mietvertrag", false).click();
    await page
      .locator(`label >> text=${de.builder.nodeEditingSidebar.nameInput.label}`)
      .fill("Nicht wirksamer Mietvertrag");

    await expect(locateNode(page, "Nicht wirksamer Mietvertrag")).toBeVisible();
  });

  test("should be able to edit content of node", async ({ page }) => {
    const richTextEditor = page.locator(
      `data-test=richTextEditor >> [contenteditable=true]`
    );
    await locateNode(page, "Sachmangel", false).click();
    await richTextEditor.fill("Hello World");

    await expect(richTextEditor).toContainText("Hello World");
  });

  //FIXME after preview is updated
  test("should be able to open preview at the selected node", async ({
    page,
  }) => {
    test.fixme();
  });

  test("should not be able to delete the startnode", async ({ page }) => {
    await locateNode(page, "Start", false).click();

    await page
      .locator(
        `text=${t(de.builder.nodeEditingSidebar.menu.iconLabel)({
          name: "Start",
        })}`
      )
      .click();

    const deleteOption = page.locator(
      `text=${de.builder.nodeEditingSidebar.menu.deleteNode.label}`
    );
    await deleteOption.hover();
    await expect(
      page.locator(
        `role=tooltip >> text=${de.builder.nodeEditingSidebar.menu.deleteNode.disabledForStartNodeLabel}`
      )
    ).toBeVisible();
    await deleteOption.click();

    await expect(locateNode(page, "Start")).toBeVisible();
  });

  test("should be able to reassign start node", async ({ page }) => {
    await locateNode(page, "Wirksamer Mietvertrag", false).click();

    await page
      .locator(
        `text=${t(de.builder.nodeEditingSidebar.menu.iconLabel)({
          name: "Wirksamer Mietvertrag",
        })}`
      )
      .click();

    await page
      .locator(`text=${de.builder.nodeEditingSidebar.menu.makeStartNode.label}`)
      .click();

    await expect(page.locator(`aside >> text=Start`)).toBeVisible();
  });

  test("should be able to delete node", async ({ page }) => {
    await locateNode(page, "Wirksamer Mietvertrag", false).click();

    await page
      .locator(
        `text=${t(de.builder.nodeEditingSidebar.menu.iconLabel)({
          name: "Wirksamer Mietvertrag",
        })}`
      )
      .click();

    await page
      .locator(`text=${de.builder.nodeEditingSidebar.menu.deleteNode.label}`)
      .click();

    await expect(
      locateNode(page, "Wirksamer Mietvertrag", false)
    ).not.toBeVisible();
  });

  test("should be able to select parent nodes", async ({ page }) => {
    await locateNode(page, "Wirksamer Mietvertrag", false).click();

    await page
      .locator(`text=${de.builder.nodeEditingSidebar.parentNodeSelector.label}`)
      .click();

    await page.locator(`role=menuitem >> text=Start`).click();

    await expect(locateNode(page, "Start")).toBeVisible();
  });
});

test("should be able to go back to Dashboard", async ({ page }) => {
  await page.locator(`text=${de.common.header.homeButtonHiddenLabel}`).click();
  await expect(page).toHaveURL("/");
});

test.describe("project menu", () => {
  test.beforeEach(async ({ page }) => {
    const trees = getFromEnv<WithTrees>("trees");
    await page
      .locator(`button >> text=${trees.activeTree.name}`)
      .dispatchEvent("pointerdown");
  });

  test("should be able to change tree name", async ({ page }) => {
    await page.locator(`text=${de.common.projectMenu.changeName}`).click();

    await page
      .locator(
        `label >> text=${de.common.updateTreeDialog.treeNameInput.label}`
      )
      .fill("Neuer Baumname");

    await Promise.all([
      page.waitForResponse("/api/external-api/trees/*"),
      page
        .locator(`button >> text=${de.common.updateTreeDialog.submit}`)
        .click(),
    ]);

    await expect(
      page.locator(`text=${de.common.notifications.updateProject.title}`)
    ).toBeVisible();
    await expect(
      page.locator(`text=${de.common.updateTreeDialog.title}`)
    ).not.toBeVisible();
    await expect(page.locator(`text=Neuer Baumname`)).toBeVisible();
  });

  test("should be able to export tree", async ({ page }) => {
    await page.locator(`text=${de.common.projectMenu.export}`).click();

    await page
      .locator(`text=${de.common.exportDialog.customization.nameInput.label}`)
      .fill("Export Name");
    await page
      .locator(`text=${de.common.exportDialog.customization.submit}`)
      .click();

    const [download] = await Promise.all([
      // It is important to call waitForEvent before click to set up waiting.
      page.waitForEvent("download"),
      // Triggers the download.
      page.locator(`a >> text=${de.common.exportDialog.save.cta}`).click(),
    ]);

    await expect(download.suggestedFilename()).toBe("Export Name.json");
    await expect(
      page.locator(`text=${de.common.notifications.export.title}`)
    ).toBeVisible();
  });

  test("should be able to delete tree", async ({ page }) => {
    const trees = getFromEnv<WithTrees>("trees");
    await page.locator(`text=${de.common.projectMenu.delete}`).click();

    await page
      .locator(`text=${de.common.deleteTreeDialog.treeNameInput.label}`)
      .fill(trees.activeTree.name);

    await page
      .locator(`button >> text=${de.common.deleteTreeDialog.submit}`)
      .click();

    await expect(page).toHaveURL("/");
    await expect(
      page.locator(`text=${de.common.notifications.deleteProject.title}`)
    ).toBeVisible();
    await expect(
      page.locator(`h2 >> text=${trees.activeTree.name}`)
    ).not.toBeVisible();
  });
});

test("should be able to navigate to renderer", async ({ page, context }) => {
  const trees = getFromEnv<WithTrees>("trees");

  await openProjectMenu(page, trees.activeTree.name);
  await openPublishSubMenu(page);
  await publishTreeAction(page);

  await openProjectMenu(page, trees.activeTree.name);
  await openPublishSubMenu(page);

  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    openPublishedTreeAction(page),
  ]);

  await expect(newPage).toHaveURL(/\/public*/);
  await expect(newPage.locator("text=Willkommen")).toBeVisible();
});

test("should be able to activate and deactivate the preview", async ({
  page,
  context,
}) => {
  await openPreviewPopover(page);
  await togglePreviewCheckbox(page);
  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    openPreviewPage(page),
  ]);

  await expect(newPage).toHaveURL(/\/*preview/);
  await expect(newPage.locator("text=Willkommen")).toBeVisible();

  await Promise.all([
    page.waitForLoadState("networkidle"),
    togglePreviewCheckbox(page),
  ]);

  await newPage.reload();
  await expect(
    newPage.locator(`text=${de.common.errors.PREVIEW_NOT_ENABLED.long}`)
  ).toBeVisible();
});
