import { Badge } from "@open-legal-tech/design-system";
import { useSyncMachine } from "features/Builder/state/useTree";

export function SyncIndicator() {
  const [syncState] = useSyncMachine();

  return (
    <Badge
      variant="secondary"
      css={{ position: "absolute", left: 10, bottom: 10 }}
    >
      {syncState.matches("sync") ? "Syncing" : "Idle"}
    </Badge>
  );
}
