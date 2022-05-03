export type CommonErrors = "GENERIC_ERROR";

export type ProgrammerErrors =
  | "MISSING_CONTEXT_PROVIDER"
  | "TRIED_VERIFY_UNAUTHENTICATED_USER_LOGIN"
  | "MISSING_ENV_VARIABLE";

export type InterpreterErrors =
  | "GENERIC_ERROR"
  | "INVALID_TREE"
  | "MISSING_STARTNODE"
  | "NO_EDGE_FOR_THRUTHY_CONDITION"
  | "NO_TRUTHY_CONDITION";

export type BuilderErrors =
  | "AUTH_VALIDATION_FAILED"
  | "WEBSOCKET_CONNECTION_FAILED";

export type ErrorCodes =
  | CommonErrors
  | ProgrammerErrors
  | `INTERPRETER_${InterpreterErrors}`
  | `BUILDER_${BuilderErrors}`;
