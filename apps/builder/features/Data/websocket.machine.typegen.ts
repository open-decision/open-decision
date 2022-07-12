// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    assignDataToContext: "OPEN";
    incrementRetries: "RETRY";
  };
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
    "done.invoke.openWebsocketConnection": {
      type: "done.invoke.openWebsocketConnection";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.openWebsocketConnection": {
      type: "error.platform.openWebsocketConnection";
      data: unknown;
    };
  };
  invokeSrcNameMap: {
    openWebsocket: "done.invoke.openWebsocketConnection";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    openWebsocket: "OPEN" | "RETRY";
  };
  eventsCausingGuards: {
    underRetryLimit: "RETRY";
  };
  eventsCausingDelays: {};
  matchesStates: "unconnected" | "connected" | "closed" | "error";
  tags: never;
}
