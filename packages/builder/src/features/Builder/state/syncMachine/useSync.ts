import { useActor } from "@xstate/react";
import { useTree } from "../treeMachine/useTree";

export function useSync() {
  const [syncMachineRef] = useTree((state) => state.syncMachineRef);

  if (!syncMachineRef)
    throw new Error(`The syncMachine has not been properly initalized.`);

  return useActor(syncMachineRef);
}
