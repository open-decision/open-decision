// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    assignErrorToContext: "FAILED_VERIFY_LOGIN";
  };
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
  eventsCausingServices: {
    verifyLogin: "VERIFY_LOGIN";
  };
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates:
    | "unverified"
    | "verifingLogin"
    | "verified"
    | "verification_failed";
  tags: never;
}
