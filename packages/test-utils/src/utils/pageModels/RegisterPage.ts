import { de } from "@open-decision/translations";
import { Locator, Page } from "@playwright/test";
import { TUser, UserFixture } from "../../fixtures/User";
import { NotificationComponent } from "../componentModels/NotificationComponent";

export class RegisterPage {
  readonly page: Page;
  readonly User: UserFixture;
  readonly notification: NotificationComponent;
  readonly emailField: { input: Locator; error: Locator };
  readonly passwordField: { input: Locator; error: Locator };
  readonly passwordConfirmationField: { input: Locator; error: Locator };
  readonly privacyField: { input: Locator; error: Locator };
  readonly legalField: { input: Locator; error: Locator };
  readonly submitButton: Locator;
  readonly formError: Locator;
  readonly dataProtectionLink: Locator;
  readonly loginLink: Locator;
  private createdUsers: TUser[] = [];

  constructor(page: Page) {
    this.page = page;
    this.User = new UserFixture();

    this.emailField = {
      input: page.locator(`label >> text=${de.common.emailInput.label}`),
      error: page.locator(`data-test=error-email`),
    };

    this.passwordField = {
      input: page
        .locator(`label >> text=${de.common.passwordInput.label}`)
        .nth(0),
      error: page.locator(`data-test=error-password`),
    };

    this.passwordConfirmationField = {
      input: page.locator(
        `label >> text=${de.register.passwordConfirmation.label}`
      ),
      error: page.locator(`data-test=error-passwordConfirmation`),
    };

    this.privacyField = {
      input: page.locator(`label >> text=${de.register.dataProtection.start}`),
      error: page.locator(`data-test=error-privacy`),
    };

    this.legalField = {
      input: page.locator(`label >> text=${de.register.alphaDisclaimer}`),
      error: page.locator(`data-test=error-legal`),
    };

    this.submitButton = page.locator(`text=${de.register.submitButton}`);
    this.formError = page.locator(`data-test=form-error`);
    this.dataProtectionLink = page.locator(
      `text=${de.register.dataProtection.link}`
    );
    this.loginLink = page.locator(`text=${de.register.loginCTA}`);
    this.notification = new NotificationComponent(this.page);
  }

  async goto() {
    await this.page.goto("/auth/register");
  }

  async cleanup() {
    this.User.cleanup();

    this.createdUsers.forEach((user) => {
      this.User.remove(user.uuid);
    });
  }

  async register(user: TUser = this.User.create()) {
    await this.emailField.input.fill(user.email);
    await this.passwordField.input.fill(user.password);
    await this.passwordConfirmationField.input.fill(user.password);
    await this.privacyField.input.click();
    await this.legalField.input.click();
    await this.submitButton.click();

    this.createdUsers.push(user);

    return user;
  }
}
