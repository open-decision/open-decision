// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    verifyLogin: "done.invoke.(machine).verifingLogin:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    assignErrorToContext: "FAILED_VERIFY_LOGIN";
  };
  eventsCausingServices: {
    verifyLogin: "VERIFY_LOGIN";
  };
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates:
    | "unverified"
    | "verification_failed"
    | "verified"
    | "verifingLogin";
  tags: never;
}
