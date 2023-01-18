import { type PlaywrightTestConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });
dotenv.config({ path: "../../.env.local" });
const viewport =
  Number(process.env["PWDEBUG"]) === 1
    ? { width: 1920, height: 1080 }
    : undefined;

const config: PlaywrightTestConfig = {
  workers: process.env["CI"] ? 1 : 3,
  globalSetup: require.resolve("./global-setup"),
  testMatch: ["**/*.spec.ts"],
  forbidOnly: !!process.env["CI"],
  retries: process.env["CI"] ? 2 : 0,
  reporter: [["html", { open: "never" }], ["list"]],
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.1 },
    timeout: 10000,
  },
  use: {
    baseURL: process.env["OD_BUILDER_ENDPOINT"],
    locale: "de",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  webServer: !process.env["CI"]
    ? [
        {
          command: "nx serve:app",
          reuseExistingServer: true,
          port: 4000,
          cwd: "../..",
        },
        {
          command: "",
          port: 4200,
          reuseExistingServer: true,
        },
      ]
    : undefined,
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport,
        launchOptions: { devtools: true },
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        viewport,
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        viewport,
      },
    },
  ],
};

export default config;
