import { Tree } from "@open-decision/type-classes";
import { useSnapshot } from "valtio";
import { treeClientConfig } from "../../plugin/src/freeTextPlugin";

export const useTreeClient = (tree: Tree.TTree) => {
  const snapshot = useSnapshot(tree);
  const treeClient = treeClientConfig(snapshot);

  return treeClient;
};
