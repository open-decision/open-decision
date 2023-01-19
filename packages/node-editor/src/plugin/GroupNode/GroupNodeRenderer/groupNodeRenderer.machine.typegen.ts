// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    addEmptyIteration: "START_ITERATION";
    addIterationResult: "FINISH_ITERATION";
    assignIterationPosition: "EDIT_ITERATION";
    goBack: "GO_BACK";
    goForward: "GO_FORWARD";
    removeIterationHistory: "EDIT_ITERATION";
    removeUnfinishedIteration: "LEAVE_ITERATION";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    canGoBack: "GO_BACK";
    canGoFroward: "GO_FORWARD";
  };
  eventsCausingServices: {};
  matchesStates: "idle" | "running";
  tags: never;
}
