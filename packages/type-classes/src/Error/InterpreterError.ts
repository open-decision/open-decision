import { InterpreterErrors } from "./ErrorCodes";
import { ODError, ODErrorConstructorParameters } from "./ODError";

export type InterpreterErrorConstructorParameters = {
  code: InterpreterErrors;
} & Omit<ODErrorConstructorParameters, "code">;

export class InterpreterError extends ODError {
  constructor({ code, message }: InterpreterErrorConstructorParameters) {
    super({ code: `INTERPRETER_${code}`, message });
  }
}
