export type CommonErrors = "GENERIC_ERROR";

export type ProgrammerErrors =
  | "MISSING_CONTEXT_PROVIDER"
  | "TRIED_VERIFY_UNAUTHENTICATED_USER_LOGIN"
  | "MISSING_ENV_VARIABLE"
  | "UNAUTHENTICATED_API_CALL"
  | "MISSING_URL_PARTS";

export type InterpreterErrors =
  | "INVALID_TREE"
  | "MISSING_STARTNODE"
  | "NO_CURRENT_NODE";

export type BuilderErrors =
  | "AUTH_VALIDATION_FAILED"
  | "WEBSOCKET_CONNECTION_FAILED";

export enum APIErrors {
  NOT_FOUND = 404,
  NO_TREE_DATA = 400,
  UNAUTHORIZED = 401,
}

export type ErrorCodes =
  | CommonErrors
  | ProgrammerErrors
  | `INTERPRETER_${InterpreterErrors}`
  | `BUILDER_${BuilderErrors}`
  | `API_${keyof typeof APIErrors}`;
