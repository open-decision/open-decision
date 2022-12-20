import { expect } from "@playwright/test";
import { de } from "@open-decision/translations";
import { pwTest } from "@open-decision/test-utils";

pwTest.describe.configure({ mode: "parallel" });

pwTest.describe("filter", () => {
  pwTest(
    "should show active and published by default",
    async ({ dashboardPage }) => {
      await expect(
        dashboardPage.getProjectCardLocator(dashboardPage.trees.activeTree.name)
      ).toBeVisible();

      await expect(
        dashboardPage.getProjectCardLabels(
          dashboardPage.trees.activePublishedTree.name
        )
      ).toContainText(de.dashboard.treeList.treeCard.published);

      await expect(
        dashboardPage.getProjectCardLocator(
          dashboardPage.trees.archivedTree.name
        )
      ).not.toBeVisible();
    }
  );

  pwTest(
    "should show archived and published when archived filter is selected",
    async ({ dashboardPage }) => {
      await dashboardPage.filterByArchived();

      await expect(
        dashboardPage.getProjectCardLabels(
          dashboardPage.trees.archivedTree.name
        )
      ).toContainText(de.dashboard.treeList.treeCard.ARCHIVED);

      await expect(
        dashboardPage.getProjectCardLabels(
          dashboardPage.trees.archivedPublishedTree.name
        )
      ).toContainText(de.dashboard.treeList.treeCard.ARCHIVED);

      await expect(
        dashboardPage.getProjectCardLocator(dashboardPage.trees.activeTree.name)
      ).not.toBeVisible();
    }
  );

  pwTest(
    "should show active and archived, but only when published is selected",
    async ({ dashboardPage }) => {
      // FIXME this does not work, because filtering by published does not work
      pwTest.fixme();
      await dashboardPage.filterByPublished();

      await expect(
        dashboardPage.getProjectCardLocator(
          dashboardPage.trees.activePublishedTree.name
        )
      ).toBeVisible();

      await expect(
        dashboardPage.getProjectCardLabels(
          dashboardPage.trees.archivedPublishedTree.name
        )
      ).toContainText(de.dashboard.treeList.treeCard.ARCHIVED);

      await expect(
        dashboardPage.getProjectCardLocator(dashboardPage.trees.activeTree.name)
      ).not.toBeVisible();
    }
  );
});

pwTest.describe("sort", () => {
  pwTest(
    "should sort ascending or descending based on selection",
    async ({ dashboardPage }) => {
      await dashboardPage.sortByCreationDateDescending();

      await expect(dashboardPage.page.locator("h2").nth(0)).toContainText(
        "This is an active tree"
      );

      await dashboardPage.sortByCreationDateAscending();

      await expect(dashboardPage.page.locator("h2").nth(0)).toContainText(
        "This is an active and empty tree"
      );

      await dashboardPage.sortByLastEditedDescending();

      await expect(dashboardPage.page.locator("h2").nth(0)).toContainText(
        "This is an active and empty tree"
      );

      await dashboardPage.sortByLastEditedAscending();

      await expect(dashboardPage.page.locator("h2").nth(0)).toContainText(
        "This is an active and published tree"
      );
    }
  );
});

pwTest.describe("search", () => {
  pwTest(
    "should filter trees based on search query",
    async ({ dashboardPage }) => {
      await dashboardPage.search(dashboardPage.trees.activeTree.name);

      await expect(
        dashboardPage.getProjectCardLocator(dashboardPage.trees.activeTree.name)
      ).toBeVisible();

      await expect(
        dashboardPage.getProjectCardLocator(
          dashboardPage.trees.archivedEmptyTree.name
        )
      ).not.toBeVisible();
    }
  );
});

pwTest.describe("tree-operations", () => {
  pwTest("should allow opening of a tree", async ({ dashboardPage }) => {
    await dashboardPage.openProject(dashboardPage.trees.activeTree.name);

    await expect(dashboardPage.page).toHaveURL(
      `/builder/${dashboardPage.trees.activeTree.uuid}`
    );

    await dashboardPage.header.goHome();

    await expect(dashboardPage.page).toHaveURL("/");
  });

  pwTest.describe("tree publishing", () => {
    pwTest("should allow publishing of a tree", async ({ dashboardPage }) => {
      const projectMenu = dashboardPage.getProjectMenuDropdown(
        dashboardPage.trees.activeTree.name
      );

      await projectMenu.publish();

      await expect(
        dashboardPage.notification.getLocator(
          de.common.notifications.published.title
        )
      ).toBeVisible();

      await expect(
        dashboardPage.getProjectCardLabels(dashboardPage.trees.activeTree.name)
      ).toContainText(de.dashboard.treeList.treeCard.published);
    });

    pwTest(
      "should fail publishing when tree has no data",
      async ({ dashboardPage }) => {
        const projectMenu = dashboardPage.getProjectMenuDropdown(
          dashboardPage.trees.activeEmptyTree.name
        );

        await projectMenu.publish();

        await expect(
          dashboardPage.notification.getLocator(
            de.common.errors.NO_TREE_DATA.short
          )
        ).toBeVisible();
      }
    );
  });

  pwTest("should allow to change name of a tree", async ({ dashboardPage }) => {
    const newTreeName = "Neuer Baumname";

    const projectMenu = dashboardPage.getProjectMenuDropdown(
      dashboardPage.trees.activeTree.name
    );

    await projectMenu.changeName(newTreeName);

    await expect(
      dashboardPage.getProjectCardLocator(newTreeName)
    ).toBeVisible();

    await expect(
      dashboardPage.getProjectCardLocator(dashboardPage.trees.activeTree.name)
    ).not.toBeVisible();

    await expect(
      dashboardPage.notification.getLocator(
        de.common.notifications.updateProject.title
      )
    ).toBeVisible();
  });

  pwTest(
    "should allow archiving and unarchiving of a tree",
    async ({ dashboardPage }) => {
      const projectMenu = dashboardPage.getProjectMenuDropdown(
        dashboardPage.trees.activeTree.name
      );

      await projectMenu.archive();

      await expect(
        dashboardPage.getProjectCardLocator(dashboardPage.trees.activeTree.name)
      ).not.toBeVisible();

      await expect(
        dashboardPage.notification.getLocator(
          de.common.notifications.archived.title
        )
      ).toBeVisible();

      await dashboardPage.filterByArchived();

      await expect(
        dashboardPage.getProjectCardLocator(dashboardPage.trees.activeTree.name)
      ).toBeVisible();

      await projectMenu.unarchive();

      await expect(
        dashboardPage.getProjectCardLocator(dashboardPage.trees.activeTree.name)
      ).not.toBeVisible();

      await expect(
        dashboardPage.notification.getLocator(
          de.common.notifications.unarchived.title
        )
      ).toBeVisible();

      // FIXME there is currently not option to filter by active
      // await dashboardPage.filterByActive();

      // await expect(
      //   dashboardPage.getProjectCardLocator(dashboardPage.trees.activeTree.name)
      // ).toBeVisible();
    }
  );

  pwTest("should allow deleting of a tree", async ({ dashboardPage }) => {
    const projectMenu = dashboardPage.getProjectMenuDropdown(
      dashboardPage.trees.activeTree.name
    );

    await projectMenu.delete();

    await expect(
      dashboardPage.getProjectCardLocator(dashboardPage.trees.activeTree.name)
    ).not.toBeVisible();

    await expect(
      dashboardPage.notification.getLocator(
        de.common.notifications.deleteProject.title
      )
    ).toBeVisible();
  });
});
