import { Tree } from "../type-classes";
import { getNode } from "../getters";

export const updateStartNode = (tree: Tree.TTree) => (startNode: string) => {
  // We only get the node to make sure it exists.
  getNode(tree)(startNode);

  tree.startNode = startNode;
};
