import * as TreeModel from "../models/decisionTree.model";
import { APIError } from "@open-decision/type-classes";
import { docs } from "y-websocket/bin/utils";
import { TreeStatus, DecisionTree } from "@prisma/client";

export const getTreeWithUpdatedTreeData = async (
  treeUuid: string,
  userUuid?: string
) => {
  let treeFromDb: DecisionTree | null;

  if (userUuid) {
    treeFromDb = await TreeModel.getFullSingleTree(userUuid, treeUuid);
  } else {
    treeFromDb = await TreeModel.getFullSingleTreeWithoutPermissionCheck(
      treeUuid
    );
    if (treeFromDb && !treeFromDb.hasPreview)
      throw new APIError({
        code: "PREVIEW_NOT_ENABLED",
      });
  }
  // Return if the user does not own the tree he wants to get or the tree doesn't exist
  if (!treeFromDb)
    throw new APIError({
      code: "NOT_FOUND",
    });

  // Check if the tree is currently being edited using the yjs-websocket and use that version otherwise use the db's version
  const treeData = docs.has(treeFromDb.uuid)
    ? docs.get(treeFromDb.uuid).getMap("tree").toJSON()
    : treeFromDb.yDocument
    ? TreeModel.createTreeFromYDocument(treeFromDb.yDocument)
    : null;

  if (!treeData)
    throw new APIError({
      code: "NO_TREE_DATA",
      message: "This tree does not have any data.",
    });

  return {
    ...treeFromDb,
    treeData,
  };
};

export const getTreeWithPublishedTrees = (
  userUuid: string,
  treeUuid: string
) => {
  return TreeModel.getSingleTree(userUuid, treeUuid);
};

export const getDecisionTreeCollectionWithPublishedTrees = async (
  userUuid: string,
  filter?: { nameContains?: string; status?: TreeStatus }
) => {
  return TreeModel.getTreeCollection(userUuid, {
    ...filter,
  });
};
