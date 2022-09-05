import { getFromEnv } from "@open-decision/test-utils";
import { test, expect, Page, BrowserContext } from "@playwright/test";
import { de } from "@open-decision/translations";
import { withUniqueUser } from "../../utils/szenarios/withUniqueUser";
import { WithTrees, withTrees } from "../../utils/szenarios/withTrees";
import { openCardMenu, openPublishSubMenu } from "../../utils/locators";

withUniqueUser("renderer");
withTrees();

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

const openTree = async (page: Page, context: BrowserContext) => {
  const trees = getFromEnv<WithTrees>("trees");
  await openCardMenu(page, trees.activePublishedTree.name);
  await openPublishSubMenu(page);
  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    page.locator(`text=${de.common.projectMenu.publish.open}`).click(),
  ]);

  await expect(await newPage.title()).toEqual(de.renderer.pageTitle);
  await expect(newPage.locator(`text=Willkommen`)).toBeVisible();

  return newPage;
};

test("should show published tree", async ({ page, context }) => {
  await openTree(page, context);
});

test("should allow submitting answer", async ({ page, context }) => {
  const rendererPage = await openTree(page, context);
  const submitButton = rendererPage.locator(
    "button[type=submit] >> text=Weiter"
  );
  const richTextRenderer = rendererPage.locator("data-test=richTextEditor");

  await rendererPage.locator("text=Verstanden").click();
  await submitButton.click();
  await expect(richTextRenderer).toContainText(
    "Existiert ein wirksamer Mietvertrag zwischen Ihnen und dem Vermieter?"
  );
  await rendererPage.locator("text=Ja").click();
  await submitButton.click();
  await expect(richTextRenderer).toContainText(
    "An dieser Stelle geht es darum"
  );
});

test("should go back and forward", async ({ page, context }) => {
  const rendererPage = await openTree(page, context);
  const submitButton = rendererPage.locator(
    "button[type=submit] >> text=Weiter"
  );
  const goBackButton = rendererPage.locator("button >> text=Zurück");
  const goForwardButton = rendererPage.locator("button >> text=Vorwärts");
  const richTextRenderer = rendererPage.locator("data-test=richTextEditor");

  await rendererPage.locator("text=Verstanden").click();
  await submitButton.click();
  await goBackButton.click();
  await expect(richTextRenderer).toContainText("Willkommen!");
  await expect(rendererPage.locator("text=Verstanden")).toBeChecked();
  await goForwardButton.click();
  await expect(richTextRenderer).toContainText(
    "Existiert ein wirksamer Mietvertrag zwischen Ihnen und dem Vermieter?"
  );
});
