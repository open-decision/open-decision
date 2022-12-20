import { de } from "@open-decision/translations";
import { Locator, Page } from "@playwright/test";
import { UserFixture } from "../../fixtures/User";

export class ForgotPasswordPage {
  readonly page: Page;
  readonly User: UserFixture;
  readonly emailField: { input: Locator; error: Locator };
  readonly submitButton: Locator;
  readonly successTitle: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.User = new UserFixture();

    this.emailField = {
      input: page.locator(`label >> text=${de.common.emailInput.label}`),
      error: page.locator(`data-test=error-email`),
    };

    this.submitButton = page.locator(
      `button >> text=${de.forgotPassword.submitButton}`
    );

    this.successTitle = page.locator(`text=${de.forgotPassword.success.title}`);
    this.loginLink = page.locator(
      `text=${de.forgotPassword.success.loginLink}`
    );
  }

  async goto() {
    await this.page.goto("/auth/forgot_password");
  }

  async cleanup() {
    await this.User.cleanup();
  }
}
