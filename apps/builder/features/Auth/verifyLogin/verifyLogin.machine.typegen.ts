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
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    assignErrorToContext: "FAILED_VERIFY_LOGIN";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    verifyLogin: "VERIFY_LOGIN";
  };
  matchesStates:
    | "unverified"
    | "verification_failed"
    | "verified"
    | "verifingLogin";
  tags: never;
}
