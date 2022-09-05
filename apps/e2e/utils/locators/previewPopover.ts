import { de } from "@open-decision/translations";
import { Page } from "@playwright/test";

export const previewPopoverTriggerLocator = `button >> text=${de.builder.header.prototypeButton.button}`;

export const openPreviewPopover = async (page: Page) => {
  await page.locator(previewPopoverTriggerLocator).click();
};

export const previewToggleCheckboxLocator = `text=${de.builder.header.prototypeButton.popover.checkbox}`;

export const togglePreviewCheckbox = async (page: Page) => {
  await page.locator(previewToggleCheckboxLocator).click();
};

export const openPreviewLinkLocator = `text=${de.builder.header.prototypeButton.popover.newTabLink}`;

export const openPreviewPage = async (page: Page) => {
  await page.locator(openPreviewLinkLocator).click();
};
