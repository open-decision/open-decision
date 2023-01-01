import { PrismaPromise } from "@prisma/client";
import prisma from "./prismaClient";

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
  const deletePublishedTrees = prisma.publishedTree.deleteMany();
  const deleteToken = prisma.token.deleteMany();
  const deleteTree = prisma.decisionTree.deleteMany();
  const deleteManyWhitelistEntries = prisma.whitelistEntry.deleteMany();
  const deleteUser = prisma.user.deleteMany();

  await prisma.$transaction([
    deletePublishedTrees,
    deleteToken,
    deleteTree,
    deleteManyWhitelistEntries,
    deleteUser,
  ]);
}
