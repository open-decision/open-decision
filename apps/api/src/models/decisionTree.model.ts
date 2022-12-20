import prisma from "../init-prisma-client";
import { TreeStatus } from "@prisma/client";
import { TUpdateTreeInput } from "@open-decision/api-specification";
import { decodeYDoc } from "@open-decision/tree-utils";

const prismaSelectionForTree = {
  publishedTrees: { select: { uuid: true } },
  createdAt: true,
  updatedAt: true,
  name: true,
  hasPreview: true,
  status: true,
  uuid: true,
  ownerUuid: true,
};

export const createTree = async (
  userUuid: string,
  name: string,
  status?: TreeStatus
) => {
  return prisma.decisionTree.create({
    data: {
      name,
      status,
      owner: { connect: { uuid: userUuid } },
    },
    select: prismaSelectionForTree,
  });
};

export const getSingleTree = async (userUuid: string, treeUuid: string) => {
  return prisma.decisionTree.findFirst({
    where: {
      ownerUuid: userUuid,
      uuid: treeUuid,
    },
    select: prismaSelectionForTree,
  });
};

export const getFullSingleTree = async (userUuid: string, treeUuid: string) => {
  return prisma.decisionTree.findFirst({
    where: {
      ownerUuid: userUuid,
      uuid: treeUuid,
    },
  });
};

export const getSingleTreeWithPreview = async (treeUuid: string) => {
  return prisma.decisionTree.findFirst({
    where: {
      hasPreview: true,
      uuid: treeUuid,
    },
    select: prismaSelectionForTree,
  });
};

export const getFullSingleTreeWithPreview = async (treeUuid: string) => {
  return prisma.decisionTree.findFirst({
    where: {
      hasPreview: true,
      uuid: treeUuid,
    },
  });
};

export const getFullSingleTreeWithoutPermissionCheck = async (
  treeUuid: string
) => {
  return prisma.decisionTree.findFirst({
    where: {
      uuid: treeUuid,
    },
  });
};

export const getTreeCollection = async (
  userUuid: string,
  options?: {
    status?: TreeStatus;
    nameContains?: string;
  }
) => {
  return prisma.decisionTree.findMany({
    where: {
      status: options?.status,
      name: {
        contains: options?.nameContains,
        mode: "insensitive",
      },
      ownerUuid: userUuid,
    },
    select: prismaSelectionForTree,
  });
};

export const deleteTree = async (userUuid: string, treeUuid: string) => {
  return prisma.decisionTree.deleteMany({
    where: {
      ownerUuid: userUuid,
      uuid: treeUuid,
    },
  });
};

export const updateTree = async (
  userUuid: string,
  treeUuid: string,
  updateBody: TUpdateTreeInput["body"]
) => {
  return prisma.decisionTree.updateMany({
    data: updateBody,
    where: {
      ownerUuid: userUuid,
      uuid: treeUuid,
    },
  });
};

export const getRelatedPublishedTrees = async (
  userUuid: string,
  originTreeUuid: string
) => {
  return prisma.publishedTree.findMany({
    where: {
      ownerUuid: userUuid,
      originTreeUuid,
    },
  });
};

export const createTreeFromYDocument = (yDocument: string) => {
  const ydoc = decodeYDoc(yDocument);
  return ydoc.getMap("tree").toJSON();
};
