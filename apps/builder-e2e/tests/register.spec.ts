import { test, expect } from "@playwright/test";

test("should navigate to the data protection agreement", async ({ page }) => {
  test.fixme();
});

test("should navigate to login", async ({ page }) => {
  test.fixme();
});

test.describe("register with valid credentials", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/login");

    // Navigate from Login to Register
    await page.locator("[data-test='registerLink']").click();
    await expect(page).toHaveURL("/auth/register");

    // Get the inputs on the page
    const emailInput = page.locator('[data-test="email"]');
    const passwordInput = page.locator('[data-test="password"]');
    const passwordConfirmationInput = page.locator(
      '[data-test="passwordConfirmation"]'
    );
    const privacyInput = page.locator('[data-test="privacy"]');
    const legalInput = page.locator('[data-test="legal"]');

    // Fill the inputs with valid credentials
    await emailInput.fill("test@test2.com");
    await passwordInput.fill("Gettysburg1861");
    await passwordConfirmationInput.fill("Gettysburg1861");
    await privacyInput.click();
    await legalInput.click();
  });

  test("successfull register", async ({ page }) => {
    // Submit the form
    await page.locator('[data-test="submit"]').click();

    // Expect success signaled by redirect
    await expect(page).toHaveURL("/");
  });

  test("should show error when user is offline", async ({ page }) => {
    await page.route("**/auth/login", (route) =>
      route.abort("internetdisconnected")
    );

    await page.locator('[data-test="submit"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });
});

test.describe("register with invalid credentials", () => {
  test.beforeEach(async ({ page }) => {
    test.fixme();
  });

  test("should show field error when data is missing and not send request", async ({
    page,
  }) => {
    test.fixme();
  });

  test("should show relevant error when register was unsucessfull", async ({
    page,
  }) => {
    test.fixme();
  });
});
