import { useSnapshot } from "valtio";
import { TTreeContext } from "../TreeContext";

export function useTreeSuspension(tree: TTreeContext["tree"]) {
  const {
    nonSyncedStore: { synced },
  } = useSnapshot(tree);
}
