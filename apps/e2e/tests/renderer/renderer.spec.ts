import { expect } from "@playwright/test";
import { pwTest } from "@open-decision/test-utils";

pwTest("should allow submitting answer", async ({ publishedPage }) => {
  await publishedPage.renderer.submitButton.click();

  await expect(publishedPage.renderer.richTextRenderer).toContainText(
    "Voraussetzungen der CC Lizenzierung"
  );

  await publishedPage.renderer.submitButton.click();

  await publishedPage.page
    .locator(
      "label >> text=Creative Commons Namensnennung 4.0 International (CC BY 4.0)"
    )
    .click();

  await publishedPage.renderer.submitButton.click();

  await expect(publishedPage.renderer.richTextRenderer).toContainText(
    "Verwendung Werke Dritter"
  );
});

pwTest("should go back and remember answer", async ({ publishedPage }) => {
  await publishedPage.renderer.submitButton.click();
  await publishedPage.renderer.submitButton.click();

  await expect(publishedPage.renderer.richTextRenderer).toContainText(
    "Auswahl der Lizenzart"
  );

  await publishedPage.page
    .locator(
      "label >> text=Creative Commons Namensnennung 4.0 International (CC BY 4.0)"
    )
    .click();

  await expect(
    publishedPage.page.locator(
      "label >> text=Creative Commons Namensnennung 4.0 International (CC BY 4.0)"
    )
  ).toBeChecked();

  await publishedPage.renderer.submitButton.click();

  await expect(publishedPage.renderer.richTextRenderer).toContainText(
    "Verwendung Werke Dritter"
  );

  await publishedPage.renderer.goBackButton.click();

  await expect(
    publishedPage.page.locator(
      "label >> text=Creative Commons Namensnennung 4.0 International (CC BY 4.0)"
    )
  ).toBeChecked();
});
