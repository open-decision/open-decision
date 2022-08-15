import { test, expect } from "@playwright/test";
import { de } from "@open-decision/translations";
import { loginUniqueUserBeforeEach } from "../../utils/loginUniqueUserBeforeEach";
import { User } from "@open-decision/prisma";
import {
  getFromEnv,
  createTreeFixture,
  insertTrees,
  PartialTree,
  clearTrees,
} from "@open-decision/test-utils";
import { t } from "../../internationalize";
import { client } from "@open-decision/api-client";

loginUniqueUserBeforeEach("dashboard");

type Trees = {
  treeOne: PartialTree;
  treeTwo: PartialTree;
  treeThree: PartialTree;
};

// eslint-disable-next-line no-empty-pattern
test.beforeEach(async ({}, testInfo) => {
  testInfo.snapshotSuffix = "";
});

test.describe("filter", () => {
  test.beforeEach(async ({ request, page }) => {
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
      status: "ARCHIVED",
    });
    const treeThree = createTreeFixture({
      name: "This is a foreign Tree",
      yDocument: "",
      createdAt: new Date("2021-01-01T00:00:00.000Z"),
      updatedAt: new Date("2020-01-01T00:00:00.000Z"),
      status: "ARCHIVED",
    });

    await clearTrees(user.uuid, [
      insertTrees(user.uuid, [treeOne, treeTwo, treeThree]),
    ]);

    process.env.trees = JSON.stringify({ treeOne, treeTwo, treeThree });

    const proxiedOD = client({
      fetchFunction: async (url, { body, method }, { validation }) => {
        const response = await request.fetch(url, { data: body, method });
        let data;
        const contentType = response.headers()["content-type"];
        if (
          contentType?.includes("application/json") &&
          response.status() !== 204
        ) {
          data = await response.json();
        }

        const parsedData = validation?.parse(data) ?? data;

        return { data: parsedData, status: response.status() };
      },
      urlPrefix: "/api/external-api",
    });

    const trees = getFromEnv<Trees>("trees");

    await proxiedOD.trees.publishedTrees.create({
      params: { treeUuid: trees.treeOne.uuid },
      body: { name: "Published Tree" },
    });
    await proxiedOD.trees.publishedTrees.create({
      params: { treeUuid: trees.treeTwo.uuid },
      body: { name: "Published Tree Two" },
    });

    await page.goto("/");
  });

  test("should show active and published by default", async ({ page }) => {
    const treeOne = getFromEnv<Trees>("trees").treeOne;
    const treeThree = getFromEnv<Trees>("trees").treeThree;

    await expect(page.locator(`h2 >> text=${treeOne.name}`)).toBeVisible();
    await expect(
      page.locator(`section`, { hasText: treeOne.name })
    ).toContainText(de.dashboard.treeList.treeCard.published);

    await expect(
      page.locator(`h2 >> text=${treeThree.name}`)
    ).not.toBeVisible();
  });

  test("should show archived and published when archived filter is selected", async ({
    page,
  }) => {
    const trees = getFromEnv<Trees>("trees");

    await page.locator(`text=Filter`).click();
    await page.locator(`text=Archiviert`).click();

    await expect(
      page.locator(`section >> header`, { hasText: trees.treeTwo.name })
    ).toContainText(de.dashboard.treeList.treeCard.ARCHIVED);

    await expect(
      page.locator(`section >> header`, { hasText: trees.treeThree.name })
    ).toContainText(de.dashboard.treeList.treeCard.ARCHIVED);

    await expect(
      page.locator(`section >> text=${trees.treeOne.name}`)
    ).not.toBeVisible();
  });

  test("should show active and archived, but only when published is selected", async ({
    page,
  }) => {
    test.fixme();
    const trees = getFromEnv<Trees>("trees");
    await page.locator(`text=Filter`).click();
    await page.locator(`role=menuitemcheckbox >> text=Veröffentlicht`).click();

    await expect(
      page.locator(`h2 >> text=${trees.treeOne.name}`)
    ).toBeVisible();

    await expect(
      page.locator(`section >> header`, { hasText: trees.treeTwo.name })
    ).toContainText(de.dashboard.treeList.treeCard.ARCHIVED);

    await expect(
      page.locator(`h2 >> text=${trees.treeThree.name}`)
    ).not.toBeVisible();
  });
});

test.describe("sort", () => {
  test.beforeEach(async ({ page }) => {
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

    await page.goto("/");
  });

  test("should sort ascending or descending based on selection", async ({
    page,
  }) => {
    const sortButton = page.locator(`text=Sortieren`);

    await expect(page).toHaveScreenshot("sort-ascending-update-date.png");

    await sortButton.click();
    await page.locator(`text=Erstellungsdatum`).click();

    await expect(page).toHaveScreenshot("sort-ascending-creation-date.png");

    await sortButton.click();
    await page.locator(`text=Absteigend`).click();

    await expect(page).toHaveScreenshot("sort-descending-creation-date.png");

    await sortButton.click();
    await page.locator(`text=Zuletzt bearbeitet`).click();

    await expect(page).toHaveScreenshot("sort-descending-update-date.png");
  });
});

test.describe("search", () => {
  test.beforeEach(async ({ page }) => {
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

    await page.goto("/");
  });

  test("should filter trees based on search query", async ({ page }) => {
    const trees = getFromEnv<Trees>("trees");

    await page
      .locator(`[placeholder="${de.dashboard.treeList.search.placeholder}"]`)
      .fill(trees.treeOne.name);

    await expect(
      page.locator(`css=h2 >> text=${trees.treeOne.name}`)
    ).toBeVisible();
    await expect(
      await page.locator(`css=h2 >> text=${trees.treeTwo.name}`)
    ).not.toBeVisible();
  });
});

test.describe("tree-operations", () => {
  test.beforeEach(async ({ page }) => {
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

    await page.goto("/");
  });

  test("should allow opening of a tree", async ({ page }) => {
    const trees = getFromEnv<Trees>("trees");

    await page.locator(`css=h2 >> text=${trees.treeOne.name}`).click();

    await expect(page).toHaveURL(`/builder/${trees.treeOne.uuid}`);
    await page.locator(`text=${trees.treeOne.name}`).click();

    await page
      .locator(`text=${de.builder.projectMenu.backToDashboard}`)
      .click();

    await expect(page).toHaveURL("/");
  });

  test.describe("tree publishing", () => {
    test("should allow publishing of a tree", async ({ page }) => {
      const treeOne = getFromEnv<Trees>("trees").treeOne;

      await page
        .locator(
          `text=${t(de.dashboard.treeList.cardMenu.hiddenLabel)({
            name: treeOne.name,
          })}`
        )
        .click();

      await page.locator(`text=Veröffentlichen`).click();

      await expect(
        page.locator(`text=${de.common.successNotifications.published}`)
      ).toBeVisible();

      await expect(
        page.locator(`section`, { hasText: treeOne.name })
      ).toContainText(de.dashboard.treeList.treeCard.published);
    });

    test("should fail publishing when tree has no data", async ({ page }) => {
      const treeThree = getFromEnv<Trees>("trees").treeThree;

      await page
        .locator(
          `text=${t(de.dashboard.treeList.cardMenu.hiddenLabel)({
            name: treeThree.name,
          })}`
        )
        .click();

      await page
        .locator(`text=${de.dashboard.treeList.cardMenu.publish}`)
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
    const treeThree = getFromEnv<Trees>("trees").treeThree;

    await page
      .locator(
        `text=${t(de.dashboard.treeList.cardMenu.hiddenLabel)({
          name: treeThree.name,
        })}`
      )
      .click();

    await page.click(`text=${de.dashboard.treeList.cardMenu.changeName}`);

    await page
      .locator(
        `label:has-text("${de.common.updateTreeDialog.treeNameInput.label}")`
      )
      .fill(newTreeName);
    await page
      .locator(`css=button >> text=${de.common.updateTreeDialog.submit}`)
      .click();

    await expect(page.locator(`h2 >> text=${newTreeName}`)).toBeVisible();
    await expect(page.locator(`text=${treeThree.name}`)).not.toBeVisible();
    await expect(
      page.locator(`text=${de.common.updateTreeDialog.successNotification}`)
    ).toBeVisible();
  });

  test("should allow archiving and unarchiving of a tree", async ({ page }) => {
    const treeThree = getFromEnv<Trees>("trees").treeThree;
    const treeThreeMenu = page.locator(
      `text=${t(de.dashboard.treeList.cardMenu.hiddenLabel)({
        name: treeThree.name,
      })}`
    );
    const filterButton = page.locator(`text=Filter`);

    await treeThreeMenu.click();
    await page
      .locator(`text=${de.dashboard.treeList.cardMenu.archive}`)
      .click();

    await expect(
      page.locator(`h2 >> text=${treeThree.name}`)
    ).not.toBeVisible();
    await expect(
      page.locator(`text=${de.common.successNotifications.archived}`)
    ).toBeVisible();

    //FIXME after the filter rework
    await filterButton.click();
    await page.locator(`role=menuitemcheckbox >> text=Archiviert`).click();

    await expect(page.locator(`h2 >> text=${treeThree.name}`)).toBeVisible();

    await treeThreeMenu.click();
    await page
      .locator(`text=${de.dashboard.treeList.cardMenu.unarchive}`)
      .click();

    await expect(
      page.locator(`h2 >> text=${treeThree.name}`)
    ).not.toBeVisible();
    await expect(
      page.locator(`text=${de.common.successNotifications.unarchived}`)
    ).toBeVisible();

    await filterButton.click();
    await page.locator(`role=menuitemcheckbox >> text=Archiviert`).click();

    await expect(page.locator(`h2 >> text=${treeThree.name}`)).toBeVisible();
  });

  test("should allow deletion of a tree", async ({ page }) => {
    const treeThree = getFromEnv<Trees>("trees").treeThree;
    const treeThreeMenu = page.locator(
      `text=${t(de.dashboard.treeList.cardMenu.hiddenLabel)({
        name: treeThree.name,
      })}`
    );

    await treeThreeMenu.click();
    await page.click(`text=${de.dashboard.treeList.cardMenu.deleteProject}`);

    await page
      .locator(
        `label:has-text("${de.common.deleteTreeDialog.treeNameInput.label}")`
      )
      .fill(treeThree.name);
    await page
      .locator(`css=button >> text=${de.common.deleteTreeDialog.submit}`)
      .click();

    await expect(
      page.locator(`h2 >> text=${treeThree.name}`)
    ).not.toBeVisible();
    await expect(
      page.locator(`text=${de.common.deleteTreeDialog.successNotification}`)
    ).toBeVisible();
  });
});
