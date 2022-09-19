import { useSnapshot } from "valtio";
import { Tree } from "../../Tree/type-classes";
import { useTreeContext } from "../TreeContext";

export const useTree = <TReturn>(selector: (tree: Tree.TTree) => TReturn) => {
  const {
    tree: { tree },
  } = useTreeContext();

  const treeSnapshot = useSnapshot(tree);

  return selector(treeSnapshot);
};
