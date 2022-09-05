/* eslint-disable no-empty-pattern */
import { test, expect, Page } from "@playwright/test";
import { de } from "@open-decision/translations";
import { User } from "@open-decision/prisma";
import { createUserFixture, insertUsers } from "@open-decision/test-utils";

const getElements = (page: Page) => {
  const emailInput = page.locator(
    `label >> text=${de.common.emailInput.label}`
  );
  const passwordInput = page
    .locator(`label >> text=${de.common.passwordInput.label}`)
    .first();
  const passwordConfirmationInput = page.locator(
    `label >> text=${de.register.passwordConfirmation.label}`
  );
  const privacyInput = page.locator(
    `label >> text=${de.register.dataProtection.start}`
  );
  const legalInput = page.locator(
    `label >> text=${de.register.alphaDisclaimer}`
  );
  const submitButton = page.locator(`text=${de.register.submitButton}`);

  return {
    emailInput,
    passwordInput,
    passwordConfirmationInput,
    privacyInput,
    legalInput,
    submitButton,
  };
};

const fillWithCredentials = async (page: Page, user: User) => {
  const {
    emailInput,
    passwordConfirmationInput,
    passwordInput,
    legalInput,
    privacyInput,
  } = getElements(page);

  // Fill the inputs with valid credentials
  await emailInput.fill(user.email);
  await passwordInput.fill(user.password);
  await passwordConfirmationInput.fill(user.password);
  await privacyInput.click();
  await legalInput.click();
};

test.beforeEach(async ({}, testInfo) => {
  testInfo.snapshotSuffix = "";
});

test.describe("register with valid data", () => {
  test.beforeEach(async ({ page, browserName }) => {
    // For some reason webkit fails the navigation to auth/register when all tests are run together
    // It works fine when running it separately
    if (browserName === "webkit") test.fixme();

    const registerUser = createUserFixture();
    await page.goto("/auth/login");

    // Navigate from Login to Register
    await Promise.all([
      page.waitForNavigation(),
      page.click(`text=${de.login.registerCTA}`),
    ]);

    await expect(page, "should be on register page").toHaveURL(
      "/auth/register"
    );
    await expect(
      page.locator(`h2 >> text=${de.register.title}`),
      "register page should contain the title"
    ).toBeVisible();

    await fillWithCredentials(page, registerUser);
    process.env["registerUser"] = JSON.stringify(registerUser);
  });

  test("successfull register", async ({ page }) => {
    await Promise.all([
      page.waitForNavigation(),
      page.click(`text=${de.register.submitButton}`),
    ]);

    await expect(
      page,
      "should have redirected after successfull registration"
    ).toHaveURL("/");
  });

  test("should show error when user is offline", async ({ page }) => {
    await page.route("**/auth/register", (route) =>
      route.abort("internetdisconnected")
    );

    await page.locator(`text=${de.register.submitButton}`).click();

    await expect(
      page.locator(`text=${de.common.errors.OFFLINE.long}`),
      "should show error that user is offline"
    ).toBeVisible();
  });
});

test.describe("register with invalid credentials", () => {
  let registerUser: User;

  test.beforeEach(async ({ page }) => {
    registerUser = createUserFixture();
    await page.goto("/auth/register");
  });

  test("should show field error when data is missing", async ({ page }) => {
    const { submitButton, emailInput } = getElements(page);

    // We assume that each input works on its own so we can check all errors at once
    await emailInput.fill(registerUser.email);
    await submitButton.click();
    await expect(
      page.locator(`data-test=error-email`),
      "should not show error for input"
    ).not.toBeVisible();
    await expect(
      page.locator(`data-test=error-password`),
      "should show error for input"
    ).toBeVisible();
    await expect(
      page.locator(`data-test=error-passwordConfirmation`)
    ).toBeVisible();
    await expect(
      page.locator(`data-test=error-legal`),
      "should show error for input"
    ).toBeVisible();
    await expect(
      page.locator(`data-test=error-privacy`),
      "should show error for input"
    ).toBeVisible();
  });

  test("should show relevant error when register was unsucessfull", async ({
    page,
  }) => {
    await insertUsers([registerUser]);
    await fillWithCredentials(page, registerUser);

    const { submitButton } = getElements(page);
    await submitButton.click();

    await expect(
      page.locator(`data-test=form-error`),
      "should show form error"
    ).toBeVisible();
  });
});

test("should navigate to the data protection agreement", async ({
  page,
  context,
}) => {
  await page.goto("auth/register");

  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    page.locator(`text=${de.register.dataProtection.link}`).click(),
  ]);

  await expect(newPage, " should be on privacy page").toHaveURL(
    "https://open-decision.org/privacy"
  );
});

test("should navigate to login", async ({ page }) => {
  await page.goto("/auth/register");
  await page.locator(`text=${de.register.loginCTA}`).click();

  await expect(page, "should be on login page").toHaveURL("/auth/login");
});
