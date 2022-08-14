import { prisma } from "@open-decision/prisma";
export const setupTestDB = () => {
  beforeEach(async () => {
    const deleteToken = prisma.token.deleteMany();
    const deleteTree = prisma.decisionTree.deleteMany();
    const deleteManyWhitelistEntries = prisma.whitelistEntry.deleteMany();
    const deleteUser = prisma.user.deleteMany();

    await prisma.$transaction([
      deleteToken,
      deleteTree,
      deleteManyWhitelistEntries,
      deleteUser,
    ]);
  });

  afterAll(async () => {
    const deleteToken = prisma.token.deleteMany();
    const deleteTree = prisma.decisionTree.deleteMany();
    const deleteManyWhitelistEntries = prisma.whitelistEntry.deleteMany();
    const deleteUser = prisma.user.deleteMany();

    await prisma.$transaction([
      deleteToken,
      deleteTree,
      deleteManyWhitelistEntries,
      deleteUser,
    ]);

    await prisma.$disconnect();
  });
};
