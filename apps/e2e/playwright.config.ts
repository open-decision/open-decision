import { type PlaywrightTestConfig, devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  workers: 1,
  globalSetup: require.resolve("./utils/global-setup"),
  testDir: "./tests",
  testMatch: ["**/*.spec.ts"],
  forbidOnly: !!process.env["CI"],
  retries: process.env["CI"] ? 2 : 1,
  reporter: [["html", { open: "never" }], ["list"]],
  timeout: 60000,
  expect: {
    timeout: 60000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.1 },
  },
  use: {
    baseURL: process.env["OD_BUILDER_ENDPOINT"],
    locale: "de",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  webServer: !process.env["CI"]
    ? {
        command: "pnpm nx serve:app",
        reuseExistingServer: true,
        port: 4000,
        cwd: "../..",
      }
    : undefined,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
  ],
};

export default config;
