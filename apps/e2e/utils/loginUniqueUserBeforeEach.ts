import {
  createUserFixture,
  insertUsers,
  login,
} from "@open-decision/test-utils";
import { test } from "@playwright/test";

export const loginUniqueUserBeforeEach = (specName: string) => {
  test.beforeEach(async ({ baseURL, browserName }, testInfo) => {
    const user = createUserFixture();

    await insertUsers([user]);
    await login(user, `${specName}/${browserName}`, testInfo.title, baseURL);

    process.env["user"] = JSON.stringify(user);
  });

  test.use({
    // eslint-disable-next-line no-empty-pattern
    storageState: async ({ browserName }, use) => {
      const info = test.info();
      await use(`sessions/${specName}/${browserName}/${info.title}.json`);
    },
  });
};
