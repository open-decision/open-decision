import { Tree } from "@open-decision/type-classes";
import { useSnapshot } from "valtio";
import { selectTreeClientConfig } from "@open-decision/select-input-plugin";

export const useTreeClient = (tree: Tree.TTree) => {
  const snapshot = useSnapshot(tree);
  const treeClient = selectTreeClientConfig(snapshot);

  return treeClient;
};
