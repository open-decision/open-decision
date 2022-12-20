import prisma from "../init-prisma-client";
import * as publishedTreeModel from "../models/publishedTree.model";

export const hasPermissionsForTree = async (
  userUuidFromRequest: string,
  treeUuidFromRequest: string
) => {
  const tree = await prisma.decisionTree.findFirst({
    where: {
      uuid: {
        equals: treeUuidFromRequest,
      },
      ownerUuid: {
        equals: userUuidFromRequest,
      },
    },
  });

  if (tree) return true;
  return false;
};

export const hasPermissionsForDocumentTemplate = async (
  userUuidFromRequest: string,
  documentUuidFromRequest: string
) => {
  const documentTemplate = await prisma.documentTemplate.findFirst({
    where: {
      OR: [
        { uuid: documentUuidFromRequest, ownerUuid: userUuidFromRequest },
        {
          uuid: documentUuidFromRequest,
          decisionTree: {
            ownerUuid: userUuidFromRequest,
          },
        },
      ],
    },
  });

  if (documentTemplate) return true;
  return false;
};

export const hasPermissionsForPublishedTree = async (
  userUuidFromRequest: string,
  publishedTreeUuidFromRequest: string
) => {
  const publishedTree =
    await publishedTreeModel.getPublishedTreeFromDbWithPermission(
      userUuidFromRequest,
      publishedTreeUuidFromRequest
    );

  if (publishedTree) return true;
  return false;
};
