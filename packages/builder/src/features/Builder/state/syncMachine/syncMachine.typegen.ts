// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    syncPatchesToLocalStorage:
      | "sync"
      | "error.platform.restore"
      | ""
      | "retry"
      | "error.platform.sync";
    assignPatchesToContext: "sync" | "done.invoke.restore";
    sendPatchesReceived: "sync";
    clearPatches: "done.invoke.sync";
  };
  internalEvents: {
    "error.platform.restore": { type: "error.platform.restore"; data: unknown };
    "": { type: "" };
    "error.platform.sync": { type: "error.platform.sync"; data: unknown };
    "done.invoke.restore": {
      type: "done.invoke.restore";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.sync": {
      type: "done.invoke.sync";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    getTreePatchesFromStorage: "done.invoke.restore";
    syncFn: "done.invoke.sync";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    getTreePatchesFromStorage: "xstate.init";
    syncFn: "";
  };
  eventsCausingGuards: {
    hasPatches: "";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "restore"
    | "idle"
    | "sync"
    | "sync.initial"
    | "sync.syncing"
    | "sync.success"
    | "error"
    | { sync?: "initial" | "syncing" | "success" };
  tags: never;
}
