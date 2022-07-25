// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    assignDataToContext: "OPEN";
    assignTokenToContext: "done.invoke.authenticate";
    incrementRetries: "connection.error";
  };
  internalEvents: {
    "done.invoke.authenticate": {
      type: "done.invoke.authenticate";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.init": { type: "xstate.init" };
    "error.platform.authenticate": {
      type: "error.platform.authenticate";
      data: unknown;
    };
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
    authenticate: "done.invoke.authenticate";
    openWebsocket: "done.invoke.openWebsocketConnection";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    authenticate: "OPEN";
    openWebsocket: "done.invoke.authenticate" | "connection.error";
  };
  eventsCausingGuards: {
    underRetryLimit: "connection.error";
  };
  eventsCausingDelays: {};
  matchesStates: "unconnected" | "authenticating" | "connected" | "error";
  tags: never;
}
