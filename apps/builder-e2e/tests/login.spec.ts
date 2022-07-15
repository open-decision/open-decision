import { test, expect } from "@playwright/test";

test.describe("builder login valid credentials", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/login");

    // Click [data-test="email"]
    await page.locator('[data-test="email"]').click();

    // Fill [data-test="email"]
    await page.locator('[data-test="email"]').fill("test@test.com");

    // Click [data-test="password"]
    await page.locator('[data-test="password"]').click();

    // Fill [data-test="password"]
    await page.locator('[data-test="password"]').fill("Gettysburg1861");
  });

  test("should login and redirect after user submits credentials", async ({
    page,
  }) => {
    // Click [data-test="submit"]
    await page.locator('[data-test="submit"]').click();

    await expect(page).toHaveURL("/");
  });

  test("should show error when user is offline", async ({ page }) => {
    await page.route("**/auth/login", (route) =>
      route.abort("internetdisconnected")
    );
    await page.locator('[data-test="submit"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test("should show generic error message when request fails due to server error", async ({
    page,
  }) => {
    await page.route("**/auth/login", (route) => route.abort("failed"));
    await page.locator('[data-test="submit"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });
});

test.describe("builder login invalid credentials", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/login");

    //Setup invalid credentials
    // Click [data-test="email"]
    await page.locator('[data-test="email"]').click();

    // Fill [data-test="email"]
    await page.locator('[data-test="email"]').fill("wrong@wrong.com");

    // Click [data-test="password"]
    await page.locator('[data-test="password"]').click();

    // Fill [data-test="password"]
    await page.locator('[data-test="password"]').fill("wrongPassword");
  });

  test("should fail to login with wrong credentials and succeed with corrected ones", async ({
    page,
  }) => {
    // Try submitting invalid credentials
    await page.locator('[data-test="submit"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();

    // Correct Credentials
    await page.locator('[data-test="email"]').click();

    // Fill [data-test="email"]
    await page.locator('[data-test="email"]').fill("test@test.com");

    // Click [data-test="password"]
    await page.locator('[data-test="password"]').click();

    // Fill [data-test="password"]
    await page.locator('[data-test="password"]').fill("Gettysburg1861");

    // Submit corrected credentials
    await page.locator('[data-test="submit"]').click();
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
    // Get inputs
    const emailInput = page.locator('[data-test="email"]');
    const passwordInput = page.locator('[data-test="password"]');
    const submitButton = page.locator('[data-test="submit"]');

    // Fill email and submit
    await emailInput.fill("test@test.com");
    await submitButton.click();

    // Expect error message for the password field
    await expect(page.locator('[data-test="error-password"]')).toBeVisible();

    // Clear email fill password and submit
    await emailInput.fill("");
    await passwordInput.fill("Gettysburg1861");
    await submitButton.click();

    // Expect error message for the email field
    await expect(page.locator('[data-test="error-email"]')).toBeVisible();
  });
});
