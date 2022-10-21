import * as React from "react";
import { useSnapshot } from "valtio";
import {
  createReadOnlyTreeClient,
  TReadOnlyTreeClient,
} from "@open-decision/tree-type";
import { useTreeContext } from "../TreeContext";

export const useTree = <TReturn>(
  selector: (readOnlyTreeClient: TReadOnlyTreeClient) => TReturn
) => {
  const {
    tree: { tree },
  } = useTreeContext();

  const treeSnapshot = useSnapshot(tree);
  const readOnlyTreeClient = React.useMemo(
    () => createReadOnlyTreeClient(treeSnapshot),
    [treeSnapshot]
  );

  return selector(readOnlyTreeClient);
};
