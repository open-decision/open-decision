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
    "xstate.after(retry_delay)#websocketMachine.retry": {
      type: "xstate.after(retry_delay)#websocketMachine.retry";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    authenticate: "done.invoke.authenticate";
    openWebsocket: "done.invoke.openWebsocketConnection";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    assignDataToContext: "OPEN";
    assignTokenToContext: "done.invoke.authenticate";
    incrementRetries: "xstate.after(retry_delay)#websocketMachine.retry";
  };
  eventsCausingDelays: {
    retry_delay: "connection.error";
  };
  eventsCausingGuards: {
    underRetryLimit: "connection.error";
  };
  eventsCausingServices: {
    authenticate: "OPEN" | "xstate.after(retry_delay)#websocketMachine.retry";
    openWebsocket: "done.invoke.authenticate";
  };
  matchesStates:
    | "authenticating"
    | "connected"
    | "error"
    | "retry"
    | "unconnected";
  tags: never;
}
