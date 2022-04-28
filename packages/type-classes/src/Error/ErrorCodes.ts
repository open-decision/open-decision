export type CommonErrors = "GENERIC_ERROR";

export type ProgrammerErrors = "MISSING_CONTEXT_PROVIDER";

export type InterpreterErrors =
  | "GENERIC_ERROR"
  | "INVALID_TREE"
  | "MISSING_STARTNODE"
  | "NO_EDGE_FOR_THRUTHY_CONDITION"
  | "NO_TRUTHY_CONDITION";

export type ErrorCodes =
  | CommonErrors
  | ProgrammerErrors
  | `INTERPRETER_${InterpreterErrors}`;
