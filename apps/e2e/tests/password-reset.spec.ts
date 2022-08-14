import {
  createUserFixture,
  getFromEnv,
  insertUsers,
} from "@open-decision/test-utils";
import { test, expect } from "@playwright/test";
import { de } from "@open-decision/translations";
import { User } from "@open-decision/prisma";

test.beforeEach(async ({ page }, testInfo) => {
  testInfo.snapshotSuffix = "";
  const user = createUserFixture();
  await insertUsers([user]);
  process.env.user = JSON.stringify(user);

  await page.goto("/auth/login");
  await page
    .locator(`text=${de.common.passwordInput.forgotPasswordLink}`)
    .click();

  await expect(page).toHaveURL("/auth/forgot_password");
});

test("should send password reset request and show success message", async ({
  page,
}) => {
  const user = getFromEnv<User>("user");
  await page
    .locator(`label >> text=${de.common.emailInput.label}`)
    .fill(user.email);
  await page
    .locator(`button >> text=${de.forgotPassword.submitButton}`)
    .click();

  await expect(
    page.locator(`text=${de.forgotPassword.success.title}`)
  ).toBeVisible();

  await page.locator(`text=${de.forgotPassword.success.loginLink}`).click();
  await expect(page).toHaveURL("/auth/login");
});

// TODO not sure how to implement this
test("should send email", async ({ page }) => {
  test.fixme();
});
