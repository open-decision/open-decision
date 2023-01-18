import {
  GroupNodeModel,
  PrototypePage,
  pwTest,
} from "@open-decision/test-utils";
import { DocumentNodeModel } from "@open-decision/test-utils";
import { de } from "@open-decision/translations";
import { expect } from "@playwright/test";
import fs from "fs";

const fillAuroaTree = async (prototypePage: PrototypePage) => {
  await prototypePage.renderer.submitButton.click();

  await prototypePage.renderer.submitButton.click();

  await prototypePage.renderer.SingleSelectRenderer.selectAnswer(
    "Creative Commons Namensnennung 4.0 International (CC BY 4.0)"
  );
  await prototypePage.renderer.submitButton.click();

  await prototypePage.renderer.SingleSelectRenderer.selectAnswer(
    "Ja, in der Publikation sind Werke Dritter enthalten"
  );

  await prototypePage.renderer.submitButton.click();

  await prototypePage.renderer.SingleSelectRenderer.selectAnswer(
    "Ja, alle Drittwerke sind bekannt"
  );

  await prototypePage.renderer.submitButton.click();

  const GroupNode = new GroupNodeModel(prototypePage.page);

  await GroupNode.renderer.addItem("Drittwerk hinzufügen");

  await prototypePage.renderer.TextRenderer.fillAnswer(
    "Name des Urhebers",
    "Leo Tolstoy"
  );
  await prototypePage.renderer.TextRenderer.fillAnswer(
    "Name des Drittwerkes",
    "Krieg und Frieden"
  );

  await prototypePage.renderer.submitButton.click();

  await prototypePage.renderer.SingleSelectRenderer.selectAnswer("Ja");

  await prototypePage.renderer.submitButton.click();

  await prototypePage.renderer.TextRenderer.fillAnswer(
    "Quelle",
    "Staatsbibliothek zu Berlin"
  );

  await prototypePage.renderer.submitButton.click();

  await prototypePage.renderer.submitButton.click();

  await prototypePage.renderer.SingleSelectRenderer.selectAnswer(
    "Ja, Vereinbarung über Honorar der Autorin"
  );

  await prototypePage.renderer.submitButton.click();

  await prototypePage.renderer.TextRenderer.fillAnswer("in Euro", "5000");

  await prototypePage.renderer.submitButton.click();

  await prototypePage.renderer.TextRenderer.fillAnswer(
    "Zahlungsvereinbarung",
    "Individuelle Zahlungsvereinbarung"
  );

  await prototypePage.renderer.submitButton.click();

  await prototypePage.renderer.SingleSelectRenderer.selectAnswer(
    "Die Veröffentlichung erfolgt nur gedruckt"
  );

  await prototypePage.renderer.submitButton.click();

  await prototypePage.renderer.TextRenderer.fillAnswer(
    "Anzahl der Druckexemplare",
    "40000"
  );

  await prototypePage.renderer.submitButton.click();

  await prototypePage.renderer.SingleSelectRenderer.selectAnswer("Ja");

  await prototypePage.renderer.submitButton.click();

  await prototypePage.renderer.SingleSelectRenderer.selectAnswer("Ja");

  await prototypePage.renderer.submitButton.click();

  await prototypePage.renderer.SingleSelectRenderer.selectAnswer("Ja");

  await prototypePage.renderer.submitButton.click();

  await prototypePage.renderer.MultiSelectRenderer.selectAnswers([
    "PDF",
    "LaTex",
  ]);

  await prototypePage.renderer.submitButton.click();

  await prototypePage.renderer.MultiSelectRenderer.selectAnswers([
    "Email",
    "Hessenbox",
  ]);

  await prototypePage.renderer.submitButton.click();

  await prototypePage.renderer.SingleSelectRenderer.selectAnswer("Ja");

  await prototypePage.renderer.submitButton.click();

  await prototypePage.renderer.submitButton.click();

  await prototypePage.renderer.SingleSelectRenderer.selectAnswer("Ja");

  await prototypePage.renderer.submitButton.click();

  await prototypePage.renderer.MultiSelectRenderer.selectAnswers([
    "JPEG-Format",
    "PNG-Format",
  ]);

  await prototypePage.renderer.submitButton.click();

  await prototypePage.renderer.MultiSelectRenderer.selectAnswers([
    "Die Bilder können nur als Teil des Manuskriptes eingereicht werden",
  ]);

  await prototypePage.renderer.submitButton.click();

  await prototypePage.renderer.TextRenderer.fillAnswer(
    "Name der Autorin",
    "Leo Tolstoy"
  );
  await prototypePage.renderer.TextRenderer.fillAnswer(
    "Name des Verlages",
    "Springer"
  );
  await prototypePage.renderer.TextRenderer.fillAnswer(
    "Arbeitstitel des Werkes",
    "Meine Biographie"
  );

  await prototypePage.renderer.submitButton.click();

  await prototypePage.renderer.SingleSelectRenderer.selectAnswer("Nein");

  await prototypePage.renderer.submitButton.click();
};

pwTest.describe.configure({ mode: "parallel" });

pwTest(
  "should generate document from auroa project",
  async ({ prototypePage }, testInfo) => {
    pwTest.slow();
    await fillAuroaTree(prototypePage);

    const downloadPromise = prototypePage.page.waitForEvent("download");

    const DocumentNode = new DocumentNodeModel(prototypePage.page);
    await DocumentNode.renderer.download("Vertrag generieren");

    const download = await downloadPromise;

    await download.saveAs(
      `${testInfo.outputDir}/auroa-contract_${testInfo.project.name}.docx`
    );

    expect(
      (await fs.promises.stat((await download.path()) as string)).size
    ).toBeGreaterThan(200);
  }
);

pwTest(
  "should generate document for shared prototype",
  async ({ sharedPrototypePage }, testInfo) => {
    pwTest.slow();
    await fillAuroaTree(sharedPrototypePage);

    const downloadPromise = sharedPrototypePage.page.waitForEvent("download");

    const DocumentNode = new DocumentNodeModel(sharedPrototypePage.page);
    await DocumentNode.renderer.download("Vertrag generieren");

    const download = await downloadPromise;

    await download.saveAs(
      `${testInfo.outputDir}/auroa-contract-shared-prototype_${testInfo.project.name}.docx`
    );

    await sharedPrototypePage.page.pause();

    expect(
      (await fs.promises.stat((await download.path()) as string)).size
    ).toBeGreaterThan(200);
  }
);

pwTest("should upload template", async ({ editorPage }) => {
  await editorPage.editor.selectNode("Vertrag generieren");

  const DocumentNode = new DocumentNodeModel(editorPage.page);

  await DocumentNode.sidebar.uploadTemplate(
    "../../packages/test-utils/src/files/auroa.docx"
  );

  await expect(
    editorPage.notification.getLocator(
      de.common.notifications.addTemplate.title
    )
  ).toBeVisible();
});
