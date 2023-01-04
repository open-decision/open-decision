import { clearDB } from "@open-decision/test-utils";
import { FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  await clearDB();
  const { baseURL } = config.projects[0].use;

  if (!baseURL) throw new Error("baseURL is not defined");
}

export default globalSetup;
