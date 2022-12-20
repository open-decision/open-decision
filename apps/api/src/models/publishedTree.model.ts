import prisma from "../init-prisma-client";
import * as DecisionTreeService from "../services/tree.service";
/**
 *
 * Publish tree
 * @param {(string)} userUuid
 * @param {(string)} treeToPublish
 *
 * @returns {PublishedTree}
 */
export const publishDecisionTree = async (
  userUuid: string,
  treeToPublish: string
) => {
  const treeWithUpdatedTreeData =
    await DecisionTreeService.getTreeWithUpdatedTreeData(
      treeToPublish,
      userUuid
    );

  if (treeWithUpdatedTreeData instanceof Error) return treeWithUpdatedTreeData;

  const publishedTree = prisma.publishedTree.create({
    data: {
      name: treeWithUpdatedTreeData.name,
      treeData: treeWithUpdatedTreeData.treeData,
      owner: { connect: { uuid: userUuid } },
      originTree: { connect: { uuid: treeToPublish } },
    },
  });

  return publishedTree;
};

/**
 * Get published tree from database
 * @param {(string)} publishedTreeUuid
 * @returns {PublishedTree}
 */
export const getPublishedTreeFromDb = async (publishedTreeUuid: string) => {
  return prisma.publishedTree.findUnique({
    where: {
      uuid: publishedTreeUuid,
    },
  });
};

export const getPublishedTreeFromDbWithPermission = async (
  userUuid: string,
  publishedTreeUuid: string
) => {
  return prisma.publishedTree.findFirst({
    where: {
      uuid: publishedTreeUuid,
      ownerUuid: userUuid,
    },
  });
};

export const updatePublishedTree = async (
  publishedTreeUuid: string,
  updateBody: { treeData: object }
) => {
  // This deletes related published templates as well due to cascading deletes
  return prisma.publishedTree.update({
    where: {
      uuid: publishedTreeUuid,
    },
    data: {
      treeData: updateBody.treeData,
    },
  });
};

export const deletePublishedTree = async (publishedTreeUuid: string) => {
  // This deletes related published templates as well due to cascading deletes
  return prisma.publishedTree.delete({
    where: {
      uuid: publishedTreeUuid,
    },
  });
};
