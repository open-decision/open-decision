import { Tree } from "../type-classes";
import { getNode } from "../getters";

export const updateStartNode = (tree: Tree.TTree) => (startNode: string) => {
  const newStartNode = getNode(tree)(startNode);

  if (!newStartNode)
    return new Error(`The new startNode does not exist on the tree.`);

  tree.startNode = startNode;
};
