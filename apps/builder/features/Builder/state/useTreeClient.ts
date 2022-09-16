import { createTreeClient } from "@open-decision/tree-client";
import { useTreeContext } from "@open-decision/tree-sync";

export const useTreeClient = () => {
  const {
    tree: { tree },
  } = useTreeContext();
  return createTreeClient(tree);
};
