import { Page } from "@playwright/test";
import { de } from "@open-decision/translations";

export const projectMenuLocator = (name: string) => `button >> text=${name}`;
export const openProjectMenu = async (page: Page, name: string) => {
  await page.locator(projectMenuLocator(name)).dispatchEvent("pointerdown");
};

export const publishSubMenuLocator = `text=${de.common.projectMenu.publish.publish} >> nth=0`;
export const openPublishSubMenu = async (page: Page) => {
  await page.locator(publishSubMenuLocator).click();
};

export const publishActionLocator = `text=${de.common.projectMenu.publish.publish} >> nth=1`;
export const publishTreeAction = async (page: Page) => {
  await page.locator(publishActionLocator).click();
};

export const openPublishedTreeLocator = `text=${de.common.projectMenu.publish.open}`;
export const openPublishedTreeAction = async (page: Page) => {
  await page.locator(openPublishedTreeLocator).click();
};
