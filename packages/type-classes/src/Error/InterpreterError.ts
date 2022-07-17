import { InterpreterErrors } from "./ErrorCodes";
import { ODError, ODErrorConstructorParameters } from "./ODError";

export type InterpreterErrorConstructorParameters =
  ODErrorConstructorParameters<InterpreterErrors>;

export class InterpreterError extends ODError<InterpreterErrors> {
  constructor({ code, message }: InterpreterErrorConstructorParameters) {
    super({ code, message });
  }
}
