import { expect } from "@playwright/test";
import { de } from "@open-decision/translations";
import { createUserFixture, pwTest } from "@open-decision/test-utils";
import { APIError } from "@open-decision/type-classes";

pwTest.describe.configure({ mode: "parallel" });

pwTest.describe("builder login valid credentials", () => {
  pwTest(
    "should login and redirect after user submits credentials",
    async ({ loginPage }) => {
      await loginPage.login();
      await expect(loginPage.page).toHaveURL("/");
    }
  );

  pwTest("should show error when user is offline", async ({ loginPage }) => {
    await loginPage.page.route("**/auth/login", (route) =>
      route.abort("internetdisconnected")
    );

    await loginPage.login({ wait: false });

    await expect(loginPage.formError).toContainText(
      de.common.errors.OFFLINE.long,
      { timeout: 10000 }
    );
  });

  pwTest(
    "should show generic error message when request fails due to server error",
    async ({ loginPage }) => {
      await loginPage.page.route("**/auth/login", (route) => {
        route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify(new APIError({ code: "UNEXPECTED_ERROR" })),
        });
      });

      await loginPage.login({ wait: false });

      await expect(loginPage.formError).toContainText(
        de.common.errors.UNEXPECTED_ERROR.long,
        { timeout: 10000 }
      );
    }
  );

  pwTest("should be able to login after logging out", async ({ loginPage }) => {
    // FIXME needs editor page
    pwTest.fixme();
    await loginPage.login();

    // await page.locator(`text=${de.common.UserMenu.label}`).click();
    // await page.locator(`text=${de.common.glossary.logout}`).click();

    // await expect(page).toHaveURL("/auth/login");
  });
});

pwTest.describe("builder login invalid credentials", () => {
  pwTest(
    "should fail to login with wrong credentials and succeed with corrected ones",
    async ({ loginPage }) => {
      const nonRegisteredUser = createUserFixture();
      // Try submitting invalid credentials that we have just created and not inserted into the database
      await loginPage.login({ wait: false, user: nonRegisteredUser });
      await expect(loginPage.formError).toContainText(
        de.common.errors.INCORRECT_EMAIL_OR_PASSWORD.long
      );

      // Try a login again with correct credentials. These are coming from the login function internally.
      await loginPage.login();

      await expect(loginPage.page).toHaveURL("/");
    }
  );
});

pwTest.describe("builder login incomplete credentials", () => {
  pwTest(
    "should show error message when data is not provided",
    async ({ loginPage }) => {
      await loginPage.emailField.input.fill("test@test.com");
      await loginPage.submitButton.click();

      await expect(loginPage.passwordField.error).toBeVisible();

      await loginPage.emailField.input.clear();
      await loginPage.passwordField.input.fill("test");
      await loginPage.submitButton.click();

      await expect(loginPage.emailField.error).toBeVisible();
    }
  );
});
