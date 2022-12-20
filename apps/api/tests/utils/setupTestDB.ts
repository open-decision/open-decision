import { clearDB } from "@open-decision/test-utils";

export const clearTestDB = () => {
  beforeEach(async () => {
    await clearDB();
  });
};
