import prisma from "../init-prisma-client";
import { docs } from "y-websocket/bin/utils";
import buffer from "../utils/buffer";
import * as Y from "yjs";
import { DecisionTree } from "@prisma-client";

/**
 * Get the tree with updated treeData as JSON
 * @param {(string)} userUuid
 * @param {(string)} treeToPublish
 *
 * @returns {string}
 */
export const getTreeWithUpdatedTreeData = async (
  userUuid: string,
  treeUuid: string
) => {
  const treeFromDb = await prisma.decisionTree.findFirst({
    where: {
      uuid: treeUuid,
      ownerUuid: userUuid,
    },
  });

  // Return if the user does not own the tree he wants to get
  if (!treeFromDb) return treeFromDb;

  // Check if the tree is currently being edited using the yjs-websocket
  if (docs.has(treeFromDb)) {
    return {
      ...treeFromDb,
      treeData: docs.get(treeFromDb.uuid).getMap("tree").toJSON(),
    } as DecisionTree;
  } else {
    if (!treeFromDb.yDocument) return null;
    const ydoc = new Y.Doc();
    // Apply the base64 db-stored update data to the empty ydoc
    Y.applyUpdate(ydoc, buffer.fromBase64(treeFromDb.yDocument) as any);
    return {
      ...treeFromDb,
      treeData: ydoc.getMap("tree").toJSON(),
    } as DecisionTree;
  }
};
