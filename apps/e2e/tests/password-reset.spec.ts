import { forgotPasswordUrl } from "@open-decision/api-specification";
import { pwTest } from "@open-decision/test-utils";
import { expect } from "@playwright/test";

pwTest(
  "should send password reset request and show success message",
  async ({ forgotPasswordPage }) => {
    // This does actually send an email. The service is limited however so our credit can be used up.
    pwTest.fixme();
    const user = await forgotPasswordPage.User.insert();

    await forgotPasswordPage.emailField.input.fill(user.email);

    await Promise.all([
      forgotPasswordPage.page.waitForResponse(`**${forgotPasswordUrl}`),
      forgotPasswordPage.submitButton.click(),
    ]);

    await expect(forgotPasswordPage.successTitle).toBeVisible();

    await Promise.all([
      forgotPasswordPage.page.waitForNavigation(),
      forgotPasswordPage.loginLink.click(),
    ]);

    await expect(forgotPasswordPage.page).toHaveURL("/auth/login");
  }
);
