import { de } from "@open-decision/translations";
import { Locator, Page } from "@playwright/test";
import { User as UserType } from "@prisma/client";
import { UserFixture } from "../../fixtures/User";
import { NotificationComponent } from "../componentModels/NotificationComponent";

export class LoginPage {
  readonly page: Page;
  readonly User: UserFixture;
  readonly notification: NotificationComponent;
  readonly emailField: { input: Locator; error: Locator };
  readonly passwordField: { input: Locator; error: Locator };
  readonly submitButton: Locator;
  readonly registerLink: Locator;
  readonly passwordResetLink: Locator;
  readonly formError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.User = new UserFixture();

    this.emailField = {
      input: page.locator(`label >> text=${de.common.emailInput.label}`),
      error: page.locator(`data-test=error-email`),
    };

    this.passwordField = {
      input: page.locator(`label >> text=${de.common.passwordInput.label}`),
      error: page.locator(`data-test=error-password`),
    };

    this.registerLink = page.locator(`label >> text=${de.login.registerCTA}`);

    this.submitButton = page.locator(`text=${de.login.submitButton}`);

    this.passwordResetLink = page.locator(
      `text=${de.common.passwordInput.forgotPasswordLink}`
    );

    this.notification = new NotificationComponent(this.page);
    this.formError = page.locator(`data-test=form-error`);
  }

  async goto() {
    await this.page.goto("/auth/login");
  }

  async login(
    { user, wait }: { user?: UserType; wait: boolean } = {
      wait: true,
      user: undefined,
    }
  ) {
    const userToLogin = user ?? (await this.User.insert(user));

    await this.emailField.input.fill(userToLogin.email);
    await this.passwordField.input.fill(userToLogin.password);

    wait
      ? await Promise.all([
          this.page.waitForNavigation(),
          await this.submitButton.click(),
        ])
      : await this.submitButton.click();
  }

  async cleanup() {
    this.User.cleanup();
  }
}
