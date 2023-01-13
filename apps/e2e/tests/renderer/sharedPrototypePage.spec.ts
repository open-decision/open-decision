import { expect } from "@playwright/test";
import {
  PageErrorComponent,
  pwTest,
} from "../../../../packages/test-utils/src";

pwTest(
  "should show prototype when enabled",
  async ({ sharedPrototypePage }) => {
    await sharedPrototypePage.goto();

    await expect(
      sharedPrototypePage.page.locator("text=Willkommen")
    ).toBeVisible();
  }
);

pwTest(
  "should not show prototype when disabled",
  async ({ editorPage, context }) => {
    context.clearCookies();

    await editorPage.page.goto(`/shared/prototype/${editorPage.tree.uuid}`);

    const PageError = new PageErrorComponent(editorPage.page);

    await expect(
      PageError.locators.title("Vorschau nicht verfügbar")
    ).toBeVisible();
  }
);
