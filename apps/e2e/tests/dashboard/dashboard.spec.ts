import test, { expect } from "@playwright/test";
import { de } from "@open-decision/translations";
import { withUniqueUser } from "../../utils/szenarios/withUniqueUser";
import { getFromEnv } from "@open-decision/test-utils";
import { t } from "../../utils/internationalize";
import { WithTrees, withTrees } from "../../utils/szenarios/withTrees";
import { openCardMenu, openPublishSubMenu } from "../../utils/locators";

// eslint-disable-next-line no-empty-pattern
test.beforeEach(async ({}, testInfo) => {
  testInfo.snapshotSuffix = "";
});

withUniqueUser("dashboard");
withTrees();

test.describe("filter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should show active and published by default", async ({ page }) => {
    const trees = getFromEnv<WithTrees>("trees");

    await expect(
      page.locator(`h2 >> text=${trees.activeTree.name}`)
    ).toBeVisible();
    await expect(
      page.locator(`section`, { hasText: trees.activePublishedTree.name })
    ).toContainText(de.dashboard.treeList.treeCard.published);

    await expect(
      page.locator(`h2 >> text=${trees.archivedTree.name}`)
    ).not.toBeVisible();
  });

  test("should show archived and published when archived filter is selected", async ({
    page,
  }) => {
    const trees = getFromEnv<WithTrees>("trees");

    await page.locator(`text=Filter`).click();
    await page.locator(`text=Archiviert`).click();

    await expect(
      page.locator(`section >> header`, { hasText: trees.archivedTree.name })
    ).toContainText(de.dashboard.treeList.treeCard.ARCHIVED);

    await expect(
      page.locator(`section >> header`, {
        hasText: trees.archivedPublishedTree.name,
      })
    ).toContainText(de.dashboard.treeList.treeCard.ARCHIVED);

    await expect(
      page.locator(`section >> text=${trees.activeTree.name}`)
    ).not.toBeVisible();
  });

  test("should show active and archived, but only when published is selected", async ({
    page,
  }) => {
    test.fixme();
    const trees = getFromEnv<WithTrees>("trees");
    await page.locator(`text=Filter`).click();
    await page.locator(`role=menuitemcheckbox >> text=Veröffentlicht`).click();

    await expect(
      page.locator(`h2 >> text=${trees.activePublishedTree.name}`)
    ).toBeVisible();

    await expect(
      page.locator(`section >> header`, {
        hasText: trees.archivedPublishedTree.name,
      })
    ).toContainText(de.dashboard.treeList.treeCard.ARCHIVED);

    await expect(
      page.locator(`h2 >> text=${trees.activeTree.name}`)
    ).not.toBeVisible();
  });
});

test.describe("sort", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should sort ascending or descending based on selection", async ({
    page,
  }) => {
    const sortButton = page.locator(`text=Sortieren`);

    await expect(page.locator("h2").nth(0)).toContainText(
      "This is an active and published tree"
    );

    await sortButton.click();
    await page.locator(`text=Erstellungsdatum`).click();

    await expect(page.locator("h2").nth(0)).toContainText(
      "This is an active and empty tree"
    );

    await sortButton.click();
    await page.locator(`text=Absteigend`).click();

    await expect(page.locator("h2").nth(0)).toContainText(
      "This is an active tree"
    );

    await sortButton.click();
    await page.locator(`text=Zuletzt bearbeitet`).click();

    await expect(page.locator("h2").nth(0)).toContainText(
      "This is an active and empty tree"
    );
  });
});

test.describe("search", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should filter trees based on search query", async ({ page }) => {
    const trees = getFromEnv<WithTrees>("trees");

    await page
      .locator(`[placeholder="${de.dashboard.treeList.search.placeholder}"]`)
      .fill(trees.activeTree.name);

    await expect(
      page.locator(`css=h2 >> text=${trees.activeTree.name}`)
    ).toBeVisible();
    await expect(
      await page.locator(`css=h2 >> text=${trees.archivedEmptyTree.name}`)
    ).not.toBeVisible();
  });
});

test.describe("tree-operations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should allow opening of a tree", async ({ page }) => {
    const trees = getFromEnv<WithTrees>("trees");

    await page.locator(`css=h2 >> text=${trees.activeTree.name}`).click();

    await expect(page).toHaveURL(`/builder/${trees.activeTree.uuid}`);

    await page
      .locator(`a >> text=${de.common.header.homeButtonHiddenLabel}`)
      .click();

    await expect(page).toHaveURL("/");
  });

  test.describe("tree publishing", () => {
    test("should allow publishing of a tree", async ({ page }) => {
      const trees = getFromEnv<WithTrees>("trees");

      await openCardMenu(page, trees.activeTree.name);

      await openPublishSubMenu(page);
      await page
        .locator(`text=${de.common.projectMenu.publish.publish} >> nth=1`)
        .click();

      await expect(
        page.locator(`text=${de.common.notifications.published.title}`)
      ).toBeVisible();

      await expect(
        page.locator(`section`, { hasText: trees.activeTree.name })
      ).toContainText(de.dashboard.treeList.treeCard.published);
    });

    test("should fail publishing when tree has no data", async ({ page }) => {
      const trees = getFromEnv<WithTrees>("trees");

      await page
        .locator(
          `text=${t(de.dashboard.treeList.treeCard.menu.hiddenLabel)({
            name: trees.activeEmptyTree.name,
          })}`
        )
        .click();

      await page
        .locator(`text=${de.common.projectMenu.publish.publish} >> nth=0`)
        .press("ArrowRight");
      await page
        .locator(`text=${de.common.projectMenu.publish.publish} >> nth=1`)
        .click();

      await expect(
        await page.locator(
          `role=alert >> text=${de.common.errors.NO_TREE_DATA.short}`
        )
      ).toBeVisible();
    });
  });

  test("should allow to change name of a tree", async ({ page }) => {
    const newTreeName = "Neuer Baumname";
    const trees = getFromEnv<WithTrees>("trees");

    await page
      .locator(
        `text=${t(de.dashboard.treeList.treeCard.menu.hiddenLabel)({
          name: trees.activeTree.name,
        })}`
      )
      .click();

    await page.click(`text=${de.common.projectMenu.changeName}`);

    await page
      .locator(
        `label:has-text("${de.common.updateTreeDialog.treeNameInput.label}")`
      )
      .fill(newTreeName);
    await page
      .locator(`css=button >> text=${de.common.updateTreeDialog.submit}`)
      .click();

    await expect(page.locator(`h2 >> text=${newTreeName}`)).toBeVisible();
    await expect(
      page.locator(`text=${trees.activeTree.name}`)
    ).not.toBeVisible();
    await expect(
      page.locator(`text=${de.common.notifications.updateProject.title}`)
    ).toBeVisible();
  });

  test("should allow archiving and unarchiving of a tree", async ({ page }) => {
    const trees = getFromEnv<WithTrees>("trees");
    const tree = page.locator(
      `text=${t(de.dashboard.treeList.treeCard.menu.hiddenLabel)({
        name: trees.activeTree.name,
      })}`
    );
    const filterButton = page.locator(`text=Filter`);

    await tree.click();
    await page.locator(`text=${de.common.projectMenu.archive}`).click();

    await expect(
      page.locator(`h2 >> text=${trees.activeTree.name}`)
    ).not.toBeVisible();
    await expect(
      page.locator(`text=${de.common.notifications.archived.title}`)
    ).toBeVisible();

    //FIXME after the filter rework
    await filterButton.click();
    await page.locator(`role=menuitemcheckbox >> text=Archiviert`).click();

    await expect(
      page.locator(`h2 >> text=${trees.activeTree.name}`)
    ).toBeVisible();

    await tree.click();
    await page.locator(`text=${de.common.projectMenu.unarchive}`).click();

    await expect(
      page.locator(`h2 >> text=${trees.activeTree.name}`)
    ).not.toBeVisible();
    await expect(
      page.locator(`text=${de.common.notifications.unarchived.title}`)
    ).toBeVisible();

    await filterButton.click();
    await page.locator(`role=menuitemcheckbox >> text=Archiviert`).click();

    await expect(
      page.locator(`h2 >> text=${trees.activeTree.name}`)
    ).toBeVisible();
  });

  test("should allow deletion of a tree", async ({ page }) => {
    const trees = getFromEnv<WithTrees>("trees");
    const treeThreeMenu = page.locator(
      `text=${t(de.dashboard.treeList.treeCard.menu.hiddenLabel)({
        name: trees.activeTree.name,
      })}`
    );

    await treeThreeMenu.click();
    await page.click(`text=${de.common.projectMenu.delete}`);

    await page
      .locator(
        `label:has-text("${de.common.deleteTreeDialog.treeNameInput.label}")`
      )
      .fill(trees.activeTree.name);
    await page
      .locator(`css=button >> text=${de.common.deleteTreeDialog.submit}`)
      .click();

    await expect(
      page.locator(`h2 >> text=${trees.activeTree.name}`)
    ).not.toBeVisible();
    await expect(
      page.locator(`text=${de.common.notifications.deleteProject.title}`)
    ).toBeVisible();
  });
});
