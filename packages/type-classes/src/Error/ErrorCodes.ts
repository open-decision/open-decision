export type CommonErrors = "GENERIC_ERROR" | "UNEXPECTED_ERROR";

export type ProgrammerErrors =
  | "MISSING_CONTEXT_PROVIDER"
  | "TRIED_VERIFY_UNAUTHENTICATED_USER_LOGIN"
  | "MISSING_ENV_VARIABLE"
  | "UNAUTHENTICATED_API_CALL"
  | "MISSING_URL_PARTS"
  | "UNKNOWN_CONDITION_TYPE_IN_RESOLVER"
  | "INTERPRETER_WITHOUT_CURRENT_NODE"
  | "ENTITY_NOT_FOUND"
  | "TRYED_ADDING_INVALID_EDGE"
  | "INVALID_ENTITY_CREATION";

export type InterpreterErrors =
  | "INVALID_TREE"
  | "MISSING_STARTNODE"
  | "NO_CURRENT_NODE"
  | "NO_EDGE_FOR_THRUTHY_CONDITION"
  | "NO_TRUTHY_CONDITION";

export type BuilderErrors =
  | "AUTH_VALIDATION_FAILED"
  | "WEBSOCKET_CONNECTION_FAILED"
  | "IMPORT_INVALID_FILE"
  | "DUPLICATE_EDGE"
  | "CIRCULAR_CONNECTION"
  | "CONNECTED_TO_SELF";

export enum APIErrors {
  NOT_FOUND = 404,
  NO_TREE_DATA = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  INTERNAL_SERVER_ERROR = 500,
  EMAIL_ALREADY_USED = 400,
  INCORRECT_EMAIL_OR_PASSWORD = 401,
  UNAUTHENTICATED = 401,
  PASSWORD_RESET_FAILED = 401,
  EMAIL_VERIFICATION_FAILED = 401,
  USER_NOT_FOUND = 404,
  EMAIL_NOT_WHITELISTED = 403,
  INVALID_DATA = 400,
  WHITELIST_ENTRY_COULD_NOT_BE_CREATED = 400,
  WHITELIST_ENTRY_COULD_NOT_BE_DELETED = 400,
  VALIDATION_ERROR = 400,
  EXPIRED_TOKEN = 401,
  UNEXPECTED_ERROR = 500,
  PASSWORD_TO_WEAK = 400,
  INVALID_EMAIL = 400,
  OFFLINE = 500,
  EMAIL_NOT_SEND = 500,
  PREVIEW_NOT_ENABLED = 403,
}

export type ErrorCodes =
  | CommonErrors
  | InterpreterErrors
  | BuilderErrors
  | keyof typeof APIErrors;

export type Origins = "API" | "INTERPRETER" | "BUILDER";
