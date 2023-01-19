import {
  GroupNodeModel,
  pwTest,
  RendererPage,
} from "@open-decision/test-utils";

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

  await rendererPage.page.pause();
};

pwTest("should open group node", async ({ publishedPage }) => {
  await navigateToGroupNode(publishedPage);
});
