import * as React from "react";
import { useSnapshot } from "valtio";
import { ReadOnlyTreeClient, Tree } from "@open-decision/tree-type";
import { useTreeContext } from "../TreeContext";

export const useTree = <TReturn>(
  selector: (ReadOnlyTreeClient: ReadOnlyTreeClient<Tree.TTree>) => TReturn
) => {
  const {
    tree: { tree },
  } = useTreeContext();

  const treeSnapshot = useSnapshot(tree);
  const readOnlyTreeClient = React.useMemo(
    () => new ReadOnlyTreeClient(treeSnapshot),
    [treeSnapshot]
  );

  return selector(readOnlyTreeClient);
};

export const useSubscribedTreeClient = () => {
  const {
    tree: { tree },
  } = useTreeContext();

  const treeSnapshot = useSnapshot(tree);

  return new ReadOnlyTreeClient(treeSnapshot);
};
