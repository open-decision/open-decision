import { type PlaywrightTestConfig, devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  workers: 1,
  globalSetup: require.resolve("./global-setup"),
  testDir: "tests",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }], ["list"]],
  expect: {
    timeout: 60 * 1000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.1 },
  },
  use: {
    baseURL: process.env.OD_BUILDER_ENDPOINT,
    locale: "de",
    trace: "on",
    video: "on",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], launchOptions: { devtools: true } },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
};

export default config;
