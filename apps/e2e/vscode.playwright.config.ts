import { PlaywrightTestConfig } from "@playwright/test";
import config from "./playwright.config";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const devConfig: PlaywrightTestConfig = {
  ...config,
  use: {
    ...config.use,
    baseURL: process.env["OD_BUILDER_ENDPOINT"],
  },
};

export default devConfig;
