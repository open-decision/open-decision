import {
  clearTrees,
  createTreeFixture,
  getFromEnv,
  insertTrees,
  PartialTree,
} from "@open-decision/test-utils";
import { test, expect, Page } from "@playwright/test";
import { de } from "@open-decision/translations";
import { t } from "../../internationalize";
import { loginUniqueUserBeforeEach } from "../../utils/loginUniqueUserBeforeEach";
import { User } from "@open-decision/prisma";

type Trees = {
  treeOne: PartialTree;
  treeTwo: PartialTree;
  treeThree: PartialTree;
};

const selectNode = (page: Page, content?: string, selected = true) =>
  page.locator(
    `[aria-label="${t(de.builder.canvas.questionNode.empty.hiddenLabel)({
      content: content != null,
      name: content,
      selected,
    })}"]`
  );

const expectSelectedNodeToBeVisible = async (page: Page, content?: string) => {
  await expect(
    page.locator(
      `aside >> text=${de.builder.nodeEditingSidebar.nameInput.label}`
    )
  ).toBeVisible();

  await expect(selectNode(page, content, true)).toBeVisible();
};

loginUniqueUserBeforeEach("editor");

// eslint-disable-next-line no-empty-pattern
test.beforeEach(async ({}, testInfo) => {
  testInfo.snapshotSuffix = "";
  const user = getFromEnv<User>("user");
  const treeOne = createTreeFixture({
    name: "This is the First Tree",
    createdAt: new Date("2020-01-01T00:00:00.000Z"),
    updatedAt: new Date("2022-01-01T00:00:00.000Z"),
    status: "ACTIVE",
  });
  const treeTwo = createTreeFixture({
    name: "This is the Second Tree, which is currently being edited & has an old yDocument",
    createdAt: new Date("2020-01-01T00:00:00.000Z"),
    updatedAt: new Date("2022-01-01T00:00:00.000Z"),
    status: "ACTIVE",
  });
  const treeThree = createTreeFixture({
    name: "This is a foreign Tree",
    yDocument: "",
    createdAt: new Date("2021-01-01T00:00:00.000Z"),
    updatedAt: new Date("2020-01-01T00:00:00.000Z"),
    status: "ACTIVE",
  });

  await clearTrees(user.uuid, [
    insertTrees(user.uuid, [treeOne, treeTwo, treeThree]),
  ]);

  process.env.trees = JSON.stringify({ treeOne, treeTwo, treeThree });
});

test("should be able to open a tree", async ({ page }) => {
  const treeThree = getFromEnv<Trees>("trees").treeThree;
  await page.goto("/");
  await page.locator(`h2 >> text=${treeThree.name}`).click();

  await expect(page).toHaveURL(/builder\/*/);
});

test.beforeEach(async ({ page }) => {
  const treeOne = getFromEnv<Trees>("trees").treeOne;
  await page.goto(`/builder/${treeOne.uuid}`, { waitUntil: "networkidle" });
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
      .type("eine Frage");

    await page.locator(`role=option >> text=eine Frage`).click();
    await expect(page.locator(`role=option >> text=lame`)).not.toBeVisible();

    await expectSelectedNodeToBeVisible(page, "eine Frage");
  });

  test("should be able to create node with search queries name", async ({
    page,
  }) => {
    await page
      .locator(`[placeholder="${de.builder.nodeSearch.placeholder}"]`)
      .type("nicht existierender Knoten");

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

    await expect(page).toHaveScreenshot();
  });

  test("should be able to zoom in and out", async ({ page }) => {
    // zoom out with mouse wheel
    await page.mouse.move(200, 200);
    await page.keyboard.down("Control");
    await page.mouse.wheel(0, 500);
    await page.keyboard.up("Control");

    await expect(page).toHaveScreenshot();

    // zoom in with mouse wheel
    await page.keyboard.down("Control");
    await page.mouse.wheel(0, -500);
    await page.keyboard.up("Control");

    await expect(page).toHaveScreenshot();

    // zoom out with buttons
    await page
      .locator(
        `role=button[name="${de.builder.canvas.zoomInAndOut.zoomOut.hiddenLabel}"]`
      )
      .click();

    await expect(page).toHaveScreenshot();

    // zoom in with buttons
    await page
      .locator(
        `role=button[name="${de.builder.canvas.zoomInAndOut.zoomIn.hiddenLabel}"]`
      )
      .click();

    await expect(page).toHaveScreenshot();
  });

  test("should be able to drag nodes around", async ({ page }) => {
    await page.locator(`text=eine Frage`).dragTo(page.locator(`text=lame`));

    await expect(page).toHaveScreenshot();
  });

  test("should be able to connect two nodes", async ({ page }) => {
    await page
      .locator(`role=button[name="${de.builder.createNodeButton.hiddenLabel}"]`)
      .click();

    await page
      .locator(`data-test=ef12693e-739b-40ba-91b0-6d3e793a13c6-source-port`)
      .dragTo(selectNode(page));

    await expect(page).toHaveScreenshot();
  });

  test("should be able to delete node", async ({ page }) => {
    await selectNode(page, "lame", false).click();
    await page.keyboard.press("Backspace");

    await expect(page.locator(`text=lame`)).not.toBeVisible();
    await expect(
      page.locator(
        `data-test=657eb70b-fcc9-41bc-8611-5e7ee77fdf8e-ef12693e-739b-40ba-91b0-6d3e793a13c6-edge`
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
    await selectNode(page, "lame", false).click();

    await expect(selectNode(page, "lame")).toBeVisible();

    await page.locator(`data-test=canvas`).click();

    await expect(selectNode(page, "lame")).not.toBeVisible();
    await expect(selectNode(page, "lame", false)).toBeVisible();
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
    await selectNode(page, "lame", false).click();
    await page
      .locator(`label >> text=${de.builder.nodeEditingSidebar.nameInput.label}`)
      .fill("nicht lame");

    await expect(selectNode(page, "nicht lame")).toBeVisible();
  });

  test("should be able to edit content of node", async ({ page }) => {
    await selectNode(page, "lame", false).click();
    await page
      .locator(
        `label >> text=${de.builder.nodeEditingSidebar.richTextEditor.label}`
      )
      .click();
    await expect(page).toHaveScreenshot();

    await page.keyboard.type("Hello World");

    await expect(page.locator(`text=Hello World`)).toBeVisible();
  });

  //FIXME after preview is updated
  test("should be able to open preview at the selected node", async ({
    page,
  }) => {
    test.fixme();
  });

  test("should not be able to delete the startnode", async ({ page }) => {
    await selectNode(page, "eine Frage", false).click();

    await page
      .locator(
        `text=${t(de.builder.nodeEditingSidebar.menu.iconLabel)({
          name: "eine Frage",
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

    await expect(selectNode(page, "eine Frage")).toBeVisible();
  });

  test("should be able to reassign start node", async ({ page }) => {
    await selectNode(page, "lame", false).click();

    await page
      .locator(
        `text=${t(de.builder.nodeEditingSidebar.menu.iconLabel)({
          name: "lame",
        })}`
      )
      .click();

    await page
      .locator(`text=${de.builder.nodeEditingSidebar.menu.makeStartNode.label}`)
      .click();

    await expect(page.locator(`aside >> text=Start`)).toBeVisible();
  });

  test("should be able to delete node", async ({ page }) => {
    await selectNode(page, "lame", false).click();

    await page
      .locator(
        `text=${t(de.builder.nodeEditingSidebar.menu.iconLabel)({
          name: "lame",
        })}`
      )
      .click();

    await page
      .locator(`text=${de.builder.nodeEditingSidebar.menu.deleteNode.label}`)
      .click();

    await expect(selectNode(page, "lame", false)).not.toBeVisible();
  });

  test("should be able to select parent nodes", async ({ page }) => {
    await selectNode(page, "lame", false).click();

    await page
      .locator(`text=${de.builder.nodeEditingSidebar.parentNodeSelector.label}`)
      .click();

    await page.locator(`role=menuitem >> text=eine Frage`).click();

    await expect(selectNode(page, "eine Frage")).toBeVisible();
  });
});

// FIXME after header refactoring
test("should be able to go back to Dashboard", async ({ page }) => {
  test.fixme();
});

test.describe("project menu", () => {
  test.beforeEach(async ({ page, browserName }) => {
    const treeOne = getFromEnv<Trees>("trees").treeOne;
    // The next action does not work correctly on firefox in this test. The feature does
    // work in firefox outside of testing.
    if (browserName === "firefox") test.fixme();
    await page
      .locator(`button >> text=${treeOne.name}`)
      .dispatchEvent("pointerdown");
  });

  test("should be able to change tree name", async ({ page }) => {
    await page.locator(`text=${de.builder.projectMenu.changeName}`).click();

    await page
      .locator(
        `label >> text=${de.common.updateTreeDialog.treeNameInput.label}`
      )
      .fill("Neuer Baumname");
    await page
      .locator(`button >> text=${de.common.updateTreeDialog.submit}`)
      .click();

    await expect(
      page.locator(`text=${de.common.updateTreeDialog.successNotification}`)
    ).toBeVisible();
    await expect(
      page.locator(`text=${de.common.updateTreeDialog.title}`)
    ).not.toBeVisible();
    await expect(page.locator(`text=Neuer Baumname`)).toBeVisible();
  });

  test("should be able to export tree", async ({ page }) => {
    await page.locator(`text=${de.builder.projectMenu.export}`).click();

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
    await page.locator(`text=${de.common.successNotifications.export}`).click();
  });

  test("should be able to delete tree", async ({ page }) => {
    //FIXME  For some reason this test fails in production.
    test.fixme();
    const treeOne = getFromEnv<Trees>("trees").treeOne;
    await page.locator(`text=${de.builder.projectMenu.delete}`).click();

    await page
      .locator(`text=${de.common.deleteTreeDialog.treeNameInput.label}`)
      .fill(treeOne.name);

    await Promise.all([
      page.waitForNavigation(),
      page
        .locator(`button >> text=${de.common.deleteTreeDialog.submit}`)
        .click(),
    ]);

    await expect(page).toHaveURL("/");
    await expect(
      page.locator(`text=${de.common.deleteTreeDialog.successNotification}`)
    ).toBeVisible();
    await expect(page.locator(`h2 >> text=${treeOne.name}`)).not.toBeVisible();
  });
});

//FIXME after preview update
test("should be able to navigate to preview", async ({ page }) => {
  test.fixme();
});
