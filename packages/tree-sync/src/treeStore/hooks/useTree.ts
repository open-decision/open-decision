import { Tree } from "@open-decision/type-classes";
import { useSnapshot } from "valtio";
import { useTreeContext } from "../TreeContext";

export const useTree = <TReturn>(selector: (tree: Tree.TTree) => TReturn) => {
  const {
    tree: { tree },
  } = useTreeContext();

  const treeSnapshot = useSnapshot(tree);

  return selector(treeSnapshot);
};
