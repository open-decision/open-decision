export type CommonException = "GENERIC_EXCEPTION";

export type InterpreterExceptions =
  | "NO_EDGE_FOR_THRUTHY_CONDITION"
  | "NO_TRUTHY_CONDITION";

export type ExceptionCodes =
  | CommonException
  | `INTERPRETER_${InterpreterExceptions}`;
