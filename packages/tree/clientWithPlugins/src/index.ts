import * as React from "react";
import { createTreeClientWithPlugins } from "@open-decision/tree-client";
import { useTreeContext } from "@open-decision/tree-sync";

export const useTreeClientWithPlugins = () => {
  const {
    tree: { tree, uuid },
  } = useTreeContext();

  const treeClient = React.useMemo(
    () => createTreeClientWithPlugins(uuid, tree),
    [tree, uuid]
  );

  return treeClient;
};
