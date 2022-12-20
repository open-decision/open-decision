import { expect } from "@playwright/test";
import { de } from "@open-decision/translations";
import { pwTest } from "@open-decision/test-utils";

pwTest.describe.configure({ mode: "parallel" });

pwTest("should create new project", async ({ dashboardPage }) => {
  const newTreeName = "Mein Testprojekt";

  await dashboardPage.openCreateProjectDialog();
  await dashboardPage.createProjectDialog.nameInput.fill(newTreeName);
  await Promise.all([
    dashboardPage.page.waitForNavigation(),
    dashboardPage.createProjectDialog.submitButton.click(),
  ]);

  await expect(dashboardPage.page).toHaveURL(/\/builder*/);
  await expect(
    dashboardPage.notification.getLocator(
      de.common.notifications.createProject.title
    )
  ).toBeVisible();

  await dashboardPage.header.goHome();
  await expect(dashboardPage.createProjectDialog.title).not.toBeVisible();

  await dashboardPage.page.waitForTimeout(1000);
  await expect(dashboardPage.getProjectCardLocator(newTreeName)).toBeVisible();
});

pwTest(
  "should show error when no name is entered for new project",
  async ({ dashboardPage }) => {
    await dashboardPage.openCreateProjectDialog();
    await dashboardPage.createProjectDialog.submitButton.click();

    await expect(dashboardPage.createProjectDialog.error).toBeVisible();
  }
);

pwTest("should import an existing project", async ({ dashboardPage }) => {
  await dashboardPage.importProject("./fixtures/tree.json");

  await expect(
    dashboardPage.getProjectCardLocator("Imported Tree")
  ).toBeVisible();
});

pwTest("should not import a broken project", async ({ dashboardPage }) => {
  await dashboardPage.importProject("./fixtures/brokenTree.json");

  await expect(
    dashboardPage.notification.getLocator(
      de.common.errors.IMPORT_INVALID_FILE.short
    )
  ).toBeVisible();
});
