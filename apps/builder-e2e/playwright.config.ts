import { type PlaywrightTestConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config();

const config: PlaywrightTestConfig = {
  globalSetup: require.resolve("./global-setup"),
  testDir: "tests",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  webServer: {
    command: "pnpm nx run-many --target=serve:test --projects=builder,api",
    port: Number(process.env.PORT ?? 4300),
    cwd: "../..",
    reuseExistingServer: !process.env.CI ? true : false,
  },
  use: {
    baseURL: process.env.OD_BUILDER_ENDPOINT,
    trace: "on",
    video: "on",
    storageState: "storageState.json",
  },
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
