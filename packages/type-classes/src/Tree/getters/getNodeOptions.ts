import { Tree } from "../type-classes";
import { getConnectableNodes } from "../utils";
import { getNode } from "./getNode";

export const getNodeOptions = (tree: Tree.TTree) => (nodeId: string) => {
  const node = getNode(tree)(nodeId);

  if (!node) return undefined;

  return getConnectableNodes(tree)(nodeId);
};
