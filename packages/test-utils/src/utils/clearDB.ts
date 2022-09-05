import { PrismaPromise } from "@open-decision/prisma";
import prisma from "../client";

export const clearTrees = async (
  ownerUuid: string,
  transactions: PrismaPromise<any>[]
) => {
  const deletePublishedTrees = prisma.publishedTree.deleteMany();
  const deleteTree = prisma.decisionTree.deleteMany({ where: { ownerUuid } });

  await prisma.$transaction([
    deletePublishedTrees,
    deleteTree,
    ...transactions,
  ]);
};

export async function clearUser(email: string) {
  const deletePublishedTrees = prisma.publishedTree.deleteMany();
  const deleteToken = prisma.token.deleteMany();
  const deleteTree = prisma.decisionTree.deleteMany();
  const deleteManyWhitelistEntries = prisma.whitelistEntry.deleteMany();
  const deleteUser = prisma.user.deleteMany({ where: { email } });

  await prisma.$transaction([
    deletePublishedTrees,
    deleteToken,
    deleteTree,
    deleteManyWhitelistEntries,
    deleteUser,
  ]);
}

export async function clearDB() {
  const testAccount = await prisma.user.findFirst({
    where: { email: "test@od.org" },
  });

  const deletePublishedTrees = prisma.publishedTree.deleteMany({
    where: { NOT: { ownerUuid: testAccount?.uuid } },
  });
  const deleteToken = prisma.token.deleteMany({
    where: { NOT: { ownerUuid: testAccount?.uuid } },
  });
  const deleteTree = prisma.decisionTree.deleteMany({
    where: { NOT: { ownerUuid: testAccount?.uuid } },
  });
  const deleteManyWhitelistEntries = prisma.whitelistEntry.deleteMany();
  const deleteUser = prisma.user.deleteMany({
    where: { NOT: { email: "test@od.org" } },
  });

  await prisma.$transaction([
    deletePublishedTrees,
    deleteToken,
    deleteTree,
    deleteManyWhitelistEntries,
    deleteUser,
  ]);
}
