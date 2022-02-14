// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    clearPatches: "patchesReceived";
    addNode: "addNode";
    sendSyncEvent:
      | "addNode"
      | "updateNode"
      | "deleteNode"
      | "addRelation"
      | "updateRelation"
      | "deleteRelation"
      | "updateTree"
      | "undo"
      | "redo"
      | "connect";
    updateNode: "updateNode";
    deleteNode: "deleteNode";
    addRelation: "addRelation";
    updateRelation: "updateRelation";
    deleteRelation: "deleteRelation";
    updateTree: "updateTree";
    selectNode: "selectNode";
    selectRelation: "selectRelation";
    startConnecting: "startConnecting";
    undo: "undo";
    redo: "redo";
    connect: "connect";
    cleanUpConnect: "connect" | "abortConnect";
    spawnSyncMachine: "xstate.init";
  };
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates: "idle" | "connecting";
  tags: never;
}
