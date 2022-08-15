import { test, expect, Page } from "@playwright/test";
import { User } from "@open-decision/prisma";
import { de } from "@open-decision/translations";
import {
  clearUser,
  createUserFixture,
  insertUsers,
} from "@open-decision/test-utils";

const enterUserCredentials = async (page: Page, user: User) => {
  await page.locator(`text=${de.common.emailInput.label}`).fill(user.email);
  await page
    .locator(`label >> text=${de.common.passwordInput.label}`)
    .fill(user.password);
};

const registeredUser = createUserFixture();
const notRegisteredUser = createUserFixture();

test.beforeEach(async ({ page }, testInfo) => {
  testInfo.snapshotSuffix = "";
  await clearUser(registeredUser.email);
  await insertUsers([registeredUser]);
  await page.goto("/auth/login");
});

test.describe("builder login valid credentials", () => {
  test.beforeEach(async ({ page }) => {
    await enterUserCredentials(page, registeredUser);
  });

  test("should login and redirect after user submits credentials", async ({
    page,
  }) => {
    await page.locator(`text=${de.login.submitButton}`).click();
    await expect(page).toHaveURL("/");
  });

  test("should show error when user is offline", async ({ page }) => {
    await page.route("**/auth/login", (route) =>
      route.abort("internetdisconnected")
    );
    await page.locator(`text=${de.login.submitButton}`).click();

    await expect(
      page.locator(`text=${de.common.errors.OFFLINE.long}`)
    ).toBeVisible();
  });

  test("should show generic error message when request fails due to server error", async ({
    page,
  }) => {
    await page.route("**/auth/login", async (route) => {
      const response = await page.request.fetch(route.request());

      route.fulfill({
        response,
        status: 500,
      });
    });
    await page.locator(`text=${de.login.submitButton}`).click();

    await expect(
      page.locator(`text=${de.common.errors.UNEXPECTED_ERROR.long}`)
    ).toBeVisible();
  });

  test("should be able to login after logging out", async ({ page }) => {
    await page.locator(`text=${de.login.submitButton}`).click();

    await page.locator(`text=${de.common.UserMenu.label}`).click();
    await page.locator(`text=${de.common.glossary.logout}`).click();

    await expect(page).toHaveURL("/auth/login");
  });
});

test.describe("builder login invalid credentials", () => {
  test.beforeEach(async ({ page }) => {
    await enterUserCredentials(page, notRegisteredUser);
  });

  test("should fail to login with wrong credentials and succeed with corrected ones", async ({
    page,
  }) => {
    // Try submitting invalid credentials
    await page.click(`text=${de.login.submitButton}`);
    await expect(
      page.locator(`text=${de.common.errors.INCORRECT_EMAIL_OR_PASSWORD.long}`)
    ).toBeVisible();

    // Correct and submit credentials
    await enterUserCredentials(page, registeredUser);
    await page.click(`text=${de.login.submitButton}`);
    await expect(page).toHaveURL("/");
  });
});

test.describe("builder login incomplete credentials", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/login");
  });

  test("should show error message when data is not provided and not send a request", async ({
    page,
  }) => {
    await page.route("**/auth/login", () => test.fail());

    // Get inputs
    await page
      .locator(`text=${de.common.emailInput.label}`)
      .fill("test@test.com");
    const submitButton = page.locator(`text=${de.login.submitButton}`);

    // Fill email and submit
    await submitButton.click();

    // Expect error message for the password field
    await expect(page.locator('[data-test="error-password"]')).toBeVisible();

    // Clear email fill password and submit
    await page.locator(`text=${de.common.emailInput.label}`).fill("");
    await page
      .locator(`text=${de.common.passwordInput.label}`)
      .fill("gsdfgrsr34!");

    await submitButton.click();

    // Expect error message for the email field
    await expect(page.locator('[data-test="error-email"]')).toBeVisible();
  });
});
