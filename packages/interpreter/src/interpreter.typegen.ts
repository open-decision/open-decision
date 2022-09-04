// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.interpret_select_answer": {
      type: "done.invoke.interpret_select_answer";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.interpret_select_answer": {
      type: "error.platform.interpret_select_answer";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    resolveConditions: "done.invoke.interpret_select_answer";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    assignAnswerToContext: "ADD_USER_ANSWER";
    assignNewTarget: "VALID_INTERPRETATION";
    callOnError: "INVALID_INTERPRETATION";
    goBack: "GO_BACK";
    goForward: "GO_FORWARD";
    resetToInitialContext: "RESET";
  };
  eventsCausingServices: {
    resolveConditions: "EVALUATE_NODE_CONDITIONS";
  };
  eventsCausingGuards: {
    canGoBack: "GO_BACK";
    canGoForward: "GO_FORWARD";
  };
  eventsCausingDelays: {};
  matchesStates: "idle" | "interpreting";
  tags: never;
}
