// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    assignTreeToContext: "sync";
  };
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    syncFn: "done.invoke.sync.sync:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    syncFn: "sync";
  };
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates: "idle" | "sync" | "error";
  tags: never;
}
