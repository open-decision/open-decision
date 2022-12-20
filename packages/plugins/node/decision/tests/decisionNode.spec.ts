// import { pwTest } from "@open-decision/test-utils";

// pwTest.describe("node editing sidebar", () => {
//   pwTest("should be able to give name to node", async ({ nodeEditorPage }) => {
//     await nodeEditorPage.editor.selectNode({
//       content: "Willkommen",
//       selected: false,
//     });
//     await page
//       .locator(`label >> text=${de.builder.nodeEditingSidebar.nameInput.label}`)
//       .fill("Nicht Willkommen");

//     await expect(locateNode(page, "Nicht Willkommen")).toBeVisible();
//   });

//   test("should be able to edit content of node", async ({ page }) => {
//     const richTextEditor = page.locator(
//       `data-test=richTextEditor >> [contenteditable=true]`
//     );
//     await locateNode(page, "Sachmangel", false).click();
//     await richTextEditor.fill("Hello World");

//     await expect(richTextEditor).toContainText("Hello World");
//   });

//   //FIXME after preview is updated
//   test("should be able to open preview at the selected node", async ({
//     page,
//   }) => {
//     test.fixme();
//   });

//   test("should not be able to delete the startnode", async ({ page }) => {
//     await locateNode(page, "Start", false).click();

//     await page
//       .locator(
//         `text=${t(de.builder.nodeEditingSidebar.menu.iconLabel)({
//           name: "Start",
//         })}`
//       )
//       .click();

//     const deleteOption = page.locator(
//       `text=${de.builder.nodeEditingSidebar.menu.deleteNode.label}`
//     );
//     await deleteOption.hover();
//     await expect(
//       page.locator(
//         `role=tooltip >> text=${de.builder.nodeEditingSidebar.menu.deleteNode.disabledForStartNodeLabel}`
//       )
//     ).toBeVisible();
//     await deleteOption.click();

//     await expect(locateNode(page, "Start")).toBeVisible();
//   });

//   test("should be able to reassign start node", async ({ page }) => {
//     await locateNode(page, "Willkommen", false).click();

//     await page
//       .locator(
//         `text=${t(de.builder.nodeEditingSidebar.menu.iconLabel)({
//           name: "Willkommen",
//         })}`
//       )
//       .click();

//     await page
//       .locator(`text=${de.builder.nodeEditingSidebar.menu.makeStartNode.label}`)
//       .click();

//     await expect(page.locator(`aside >> text=Start`)).toBeVisible();
//   });

//   test("should be able to delete node", async ({ page }) => {
//     await locateNode(page, "Willkommen", false).click();

//     await page
//       .locator(
//         `text=${t(de.builder.nodeEditingSidebar.menu.iconLabel)({
//           name: "Willkommen",
//         })}`
//       )
//       .click();

//     await page
//       .locator(`text=${de.builder.nodeEditingSidebar.menu.deleteNode.label}`)
//       .click();

//     await expect(locateNode(page, "Willkommen", false)).not.toBeVisible();
//   });

//   test("should be able to select parent nodes", async ({ page }) => {
//     await locateNode(page, "Willkommen", false).click();

//     await page
//       .locator(`text=${de.builder.nodeEditingSidebar.parentNodeSelector.label}`)
//       .click();

//     await page.locator(`role=menuitem >> text=Start`).click();

//     await expect(locateNode(page, "Start")).toBeVisible();
//   });
// });
