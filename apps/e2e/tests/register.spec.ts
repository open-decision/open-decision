import { expect } from "@playwright/test";
import { de } from "@open-decision/translations";
import { pwTest } from "@open-decision/test-utils";

pwTest.describe.configure({ mode: "parallel" });

pwTest.describe("register with valid data", () => {
  pwTest("successfull register", async ({ registerPage }) => {
    await registerPage.register();

    await expect(
      registerPage.page,
      "should have redirected after successfull registration"
    ).toHaveURL("/", { timeout: 30000 });
  });

  pwTest("should show error when user is offline", async ({ registerPage }) => {
    await registerPage.page.route("**/auth/register", (route) =>
      route.abort("internetdisconnected")
    );

    await registerPage.register();

    await expect(
      registerPage.page.locator(`text=${de.common.errors.OFFLINE.long}`),
      "should show error that user is offline"
    ).toBeVisible({ timeout: 10000 });
  });
});

pwTest.describe("register with invalid credentials", () => {
  pwTest(
    "should show field error when data is missing",
    async ({ registerPage }) => {
      const registerUser = registerPage.User.create();

      // We assume that each input works on its own so we can check all errors at once
      await registerPage.emailField.input.fill(registerUser.email);
      await registerPage.submitButton.click();

      await expect(registerPage.emailField.error).not.toBeVisible();

      await expect(registerPage.passwordField.error).toBeVisible();

      await expect(registerPage.passwordConfirmationField.error).toBeVisible();

      await expect(registerPage.legalField.error).toBeVisible();

      await expect(registerPage.privacyField.error).toBeVisible();
    }
  );

  pwTest(
    "should not register when email is taken",
    async ({ registerPage }) => {
      const user = await registerPage.User.insert();

      await registerPage.register(user);

      await expect(registerPage.formError).toBeVisible();
    }
  );
});

pwTest(
  "should navigate to the data protection agreement",
  async ({ registerPage, context }) => {
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      registerPage.dataProtectionLink.click(),
    ]);

    await newPage.waitForLoadState();

    await expect(newPage, "should be on privacy page").toHaveURL(
      "https://open-decision.org/privacy"
    );
  }
);

pwTest("should navigate to login", async ({ registerPage }) => {
  await registerPage.loginLink.click();

  await expect(registerPage.page, "should be on login page").toHaveURL(
    "/auth/login"
  );
});
