import { ErrorCodes } from "@open-decision/type-classes";
import { Page } from "@playwright/test";

export const getElementByErrorCode =
  (page: Page) => async (errorCode: ErrorCodes) =>
    page.locator(`data-test=${errorCode}`);
