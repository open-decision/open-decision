import { test, expect } from "@playwright/test";
import { de } from "@open-decision/translations";
import { withUniqueUser } from "../../utils/szenarios/withUniqueUser";

withUniqueUser("dashboard");

test.beforeEach(async ({ page }, testInfo) => {
  testInfo.snapshotSuffix = "";
  await page.goto("/");
});

test("should create new project", async ({ page }) => {
  const submitButton = page.locator(
    `button[type=submit] >> text=${de.common.createTreeDialog.submit}`
  );
  const newTreeName = "Mein Testprojekt";

  await page.locator(`text=${de.common.NewProjectDropdown.label}`).click();
  await page
    .locator(`text=${de.common.NewProjectDropdown.createProjectLabel}`)
    .click();

  // Test that no tree with an empty name can be created
  await submitButton.click();

  await expect(page.locator(`data-test=error-treeName`)).toBeVisible();

  // Click the label to access the input and fill it
  await page
    .locator(`text=${de.common.createTreeDialog.treeNameInput.label}`)
    .fill(newTreeName);

  await submitButton.click();

  await expect(page).toHaveURL(/\/builder*/);

  await expect(
    page.locator(
      `role=alert >> text=${de.common.notifications.createProject.title}`
    )
  ).toBeVisible();

  await page
    .locator(`a >> text=${de.common.header.homeButtonHiddenLabel}`)
    .click();

  await expect(
    page.locator(`text=${de.common.createTreeDialog.title}`)
  ).not.toBeVisible();

  await page.waitForTimeout(1000);
  await expect(page.locator(`h2 >> text=${newTreeName}`)).toBeVisible();
});

test("should import an existing project", async ({ page }) => {
  const importOption = page.locator(
    `text=${de.common.NewProjectDropdown.importProject.label}`
  );

  await page.locator(`text=${de.common.NewProjectDropdown.label}`).click();
  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    importOption.click(),
  ]);

  await fileChooser.setFiles("./fixtures/tree.json");

  await expect(page.locator(`h2 >> text=Imported Tree`)).toBeVisible();
});

test("should not import a broken project", async ({ page }) => {
  const importOption = page.locator(
    `text=${de.common.NewProjectDropdown.importProject.label}`
  );

  await page.locator(`text=${de.common.NewProjectDropdown.label}`).click();
  // Note that Promise.all prevents a race condition
  // between clicking and waiting for the file chooser.
  const [fileChooser] = await Promise.all([
    // It is important to call waitForEvent before click to set up waiting.
    page.waitForEvent("filechooser"),
    // Opens the file chooser.
    importOption.click(),
  ]);

  await fileChooser.setFiles("./fixtures/brokenTree.json");

  await expect(
    await page.locator(
      `role=alert >> text=${de.common.errors.IMPORT_INVALID_FILE.short}`
    )
  ).toBeVisible();
});
