import { useSnapshot } from "valtio";

export function useTreeSuspension(tree) {
  const {
    nonSyncedStore: { synced: _synced },
  } = useSnapshot(tree);
}
