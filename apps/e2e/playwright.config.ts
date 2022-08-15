import { PlaywrightTestConfig } from "@playwright/test";
import config from "./playwright.ci.config";

const devConfig: PlaywrightTestConfig = {
  ...config,
  use: {
    ...config.use,
    baseURL: process.env.OD_BUILDER_ENDPOINT,
  },
  webServer: {
    command: "pnpm nx serve:app e2e",
    port: 4300,
    reuseExistingServer: !process.env.CI,
    cwd: "../..",
  },
};

export default devConfig;
