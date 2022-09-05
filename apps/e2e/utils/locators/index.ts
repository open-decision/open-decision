import { de } from "@open-decision/translations";
import { Page } from "@playwright/test";
import { t } from "../internationalize";

export const cardMenu = (name: string) =>
  `text=${t(de.dashboard.treeList.treeCard.menu.hiddenLabel)({
    name,
  })}`;

export const openCardMenu = (page: Page, name: string) =>
  page.locator(cardMenu(name)).click();

export const publishSubMenu = `text=${de.common.projectMenu.publish.publish} >> nth=0`;

export const openPublishSubMenu = (page: Page) =>
  page.locator(publishSubMenu).press("ArrowRight");
