import { useSnapshot } from "valtio";
import { useTreeContext } from "../TreeContext";

export function useStartNodeId() {
  const { tree } = useTreeContext();

  const {
    tree: { startNode },
  } = useSnapshot(tree);

  return startNode;
}
