import { InterpreterExceptions } from "./ExceptionCodes";
import { ODExceptionConstructorParameters, ODException } from "./ODException";

export type InterpreterExceptionConstructorParameters = {
  code: InterpreterExceptions;
} & Omit<ODExceptionConstructorParameters, "code">;

export class InterpreterException extends ODException {
  constructor({ code, message }: InterpreterExceptionConstructorParameters) {
    super({ code: `INTERPRETER_${code}`, message });
  }
}
