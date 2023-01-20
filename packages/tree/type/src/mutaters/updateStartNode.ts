import { Tree } from "../type-classes";
import { getNodeSingle } from "../getters";
import { TNodeId } from "@open-decision/tree-ids";

export const updateStartNode = (tree: Tree.TTree) => (startNode: TNodeId) => {
  // We only get the node to make sure it exists.
  getNodeSingle(tree)(startNode);

  tree.startNode = startNode;
};
