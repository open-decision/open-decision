import prisma from "../init-prisma-client";
import { docs } from "y-websocket/bin/utils";
import buffer from "../utils/buffer";
import * as Y from "yjs";
import { APIError } from "@open-decision/type-classes";

function createTreeFromYDocument(yDocument: string) {
  const ydoc = new Y.Doc();
  // Apply the base64 db-stored update data to the empty ydoc
  Y.applyUpdate(ydoc, buffer.fromBase64(yDocument));

  return ydoc.getMap("tree").toJSON();
}

/**
 * Get the tree with updated treeData as JSON
 * @param {(string)} userUuid
 * @param {(string)} treeToPublish
 *
 * @returns {string}
 */
export const getTreeWithUpdatedTreeData = async (
  treeUuid: string,
  userUuid?: string
) => {
  const treeFromDb = await prisma.decisionTree.findFirst({
    where: {
      uuid: treeUuid,
      ownerUuid: userUuid,
    },
  });

  // Return if the user does not own the tree he wants to get
  if (!treeFromDb)
    return new APIError({
      code: "NOT_FOUND",
      message: "The requested tree does not exist.",
    });

  // Check if the tree is currently being edited using the yjs-websocket and use that version otherwise use the dbs version
  const treeData = docs.has(treeFromDb.uuid)
    ? docs.get(treeFromDb.uuid).getMap("tree").toJSON()
    : treeFromDb.yDocument
    ? createTreeFromYDocument(treeFromDb.yDocument)
    : null;

  if (!treeData)
    return new APIError({
      code: "NO_TREE_DATA",
      message: "This tree does not have any data.",
    });

  return {
    ...treeFromDb,
    treeData,
  };
};
