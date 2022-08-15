// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.authenticate": {
      type: "done.invoke.authenticate";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.openWebsocketConnection": {
      type: "done.invoke.openWebsocketConnection";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.authenticate": {
      type: "error.platform.authenticate";
      data: unknown;
    };
    "error.platform.openWebsocketConnection": {
      type: "error.platform.openWebsocketConnection";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    authenticate: "done.invoke.authenticate";
    openWebsocket: "done.invoke.openWebsocketConnection";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    assignDataToContext: "OPEN";
    assignTokenToContext: "done.invoke.authenticate";
    incrementRetries: "connection.error";
  };
  eventsCausingServices: {
    authenticate: "OPEN";
    openWebsocket: "connection.error" | "done.invoke.authenticate";
  };
  eventsCausingGuards: {
    underRetryLimit: "connection.error";
  };
  eventsCausingDelays: {};
  matchesStates: "authenticating" | "connected" | "error" | "unconnected";
  tags: never;
}
