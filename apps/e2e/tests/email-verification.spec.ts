import { test, expect } from "@playwright/test";

// eslint-disable-next-line no-empty-pattern
test.beforeEach(async ({}, testInfo) => {
  testInfo.snapshotSuffix = "";
});

test("email send after successfull register", async ({ page }) => {
  test.fixme();
});

test("should redirect to dashboard and show success message", async ({
  page,
}) => {
  test.fixme();
});

test.describe("token expired", () => {
  test("should show error and ability to resend another token", async ({
    page,
  }) => {
    test.fixme();
  });
});
