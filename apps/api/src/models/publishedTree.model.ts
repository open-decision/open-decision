import prisma from "../init-prisma-client";
import { getTreeWithUpdatedTreeData } from "./decisionTree.model";
/**
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
  const treeWithUpdatedTreeData = await getTreeWithUpdatedTreeData(
    userUuid,
    treeToPublish
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
