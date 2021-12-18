import config from "../../src/config/config";
import prisma from "../../src/init-prisma-client";
export const setupTestDB = () => {
  // // beforeAll(async () => {
  // //   // create product categories

  // })

  beforeEach(async () => {
    const deleteUser = prisma.user.deleteMany();
    const deleteToken = prisma.token.deleteMany();

    await prisma.$transaction([deleteToken, deleteUser]);
  });

  afterAll(async () => {
    const deleteUser = prisma.user.deleteMany();
    const deleteToken = prisma.token.deleteMany();

    await prisma.$transaction([deleteToken, deleteUser]);

    await prisma.$disconnect();
  });
};
