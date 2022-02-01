import config from "../../src/config/config";
import prisma from "../../src/init-prisma-client";
export const setupTestDB = () => {
  beforeEach(async () => {
    const deleteToken = prisma.token.deleteMany();
    const deleteTree = prisma.decisionTree.deleteMany();
    const deleteUser = prisma.user.deleteMany();

    await prisma.$transaction([deleteToken, deleteTree, deleteUser]);
  });

  afterAll(async () => {
    const deleteToken = prisma.token.deleteMany();
    const deleteTree = prisma.decisionTree.deleteMany();
    const deleteUser = prisma.user.deleteMany();

    await prisma.$transaction([deleteToken, deleteTree, deleteUser]);

    await prisma.$disconnect();
  });
};
