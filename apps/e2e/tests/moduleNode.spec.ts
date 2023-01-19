import {
  GroupNodeModel,
  pwTest,
  RendererPage,
} from "@open-decision/test-utils";
import { expect } from "@playwright/test";

const navigateToGroupNode = async (rendererPage: RendererPage) => {
  await rendererPage.renderer.submitButton.click();
  await rendererPage.renderer.submitButton.click();

  await rendererPage.renderer.SingleSelectRenderer.selectAnswer(
    "Creative Commons Namensnennung 4.0 International (CC BY 4.0)"
  );
  await rendererPage.renderer.submitButton.click();

  await rendererPage.renderer.SingleSelectRenderer.selectAnswer(
    "Ja, in der Publikation sind Werke Dritter enthalten"
  );

  await rendererPage.renderer.submitButton.click();

  await rendererPage.renderer.SingleSelectRenderer.selectAnswer(
    "Ja, alle Drittwerke sind bekannt"
  );

  await rendererPage.renderer.submitButton.click();
};

const fillGroupNode = async (rendererPage: RendererPage) => {
  const GroupNode = new GroupNodeModel(rendererPage.page);

  await GroupNode.renderer.addItem("Drittwerk hinzufügen");

  await rendererPage.renderer.TextRenderer.fillAnswer(
    "Name des Urhebers",
    "Leo Tolstoy"
  );
  await rendererPage.renderer.TextRenderer.fillAnswer(
    "Name des Drittwerkes",
    "Krieg und Frieden"
  );

  await rendererPage.renderer.submitButton.click();

  await rendererPage.renderer.SingleSelectRenderer.selectAnswer("Ja");

  await rendererPage.renderer.submitButton.click();

  await rendererPage.renderer.TextRenderer.fillAnswer(
    "Quelle",
    "Staatsbibliothek zu Berlin"
  );

  await rendererPage.renderer.submitButton.click();
};

pwTest(
  "should be able to add multiple answers to module",
  async ({ publishedPage }) => {
    await navigateToGroupNode(publishedPage);

    await fillGroupNode(publishedPage);

    await fillGroupNode(publishedPage);

    const GroupNode = new GroupNodeModel(publishedPage.page);

    await expect(
      GroupNode.renderer.locators.iterationTitle("1. Antwort")
    ).toBeVisible();

    await expect(
      GroupNode.renderer.locators.iterationTitle("2. Antwort")
    ).toBeVisible();
  }
);

pwTest("should be able to edit module iteration", async ({ publishedPage }) => {
  await navigateToGroupNode(publishedPage);

  await fillGroupNode(publishedPage);

  const GroupNode = new GroupNodeModel(publishedPage.page);

  await GroupNode.renderer.editIteration("1. Antwort");

  await publishedPage.renderer.TextRenderer.fillAnswer(
    "Name des Drittwerkes",
    "Anna Karenina"
  );

  await publishedPage.renderer.submitButton.click();
  await publishedPage.renderer.submitButton.click();
  await publishedPage.renderer.submitButton.click();

  await expect(publishedPage.page.getByText("Anna Karenina")).toBeVisible();
});
