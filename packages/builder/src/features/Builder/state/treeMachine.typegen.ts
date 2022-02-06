// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    addNode: "addNode";
    syncTreeWithLocalStorage:
      | "addNode"
      | "updateNode"
      | "deleteNode"
      | "addRelation"
      | "updateRelation"
      | "deleteRelation"
      | "updateTree"
      | "selectNode"
      | "selectRelation"
      | "connect";
    sendSyncEvent:
      | "addNode"
      | "updateNode"
      | "deleteNode"
      | "addRelation"
      | "updateRelation"
      | "deleteRelation"
      | "updateTree"
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
    connect: "connect";
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
