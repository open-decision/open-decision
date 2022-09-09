import { Tree } from "@open-decision/type-classes";
import { createTreeClient } from "@open-decision/tree-client";

export const useTreeClient = (tree: Tree.TTree) => {
  const treeClient = createTreeClient(tree);

  return treeClient;
};
