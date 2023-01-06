import { TInterpreterErrors } from "./ErrorCodes";
import { ODError, ODErrorConstructorParameters } from "./ODError";

export type InterpreterErrorConstructorParameters =
  ODErrorConstructorParameters<TInterpreterErrors>;

export class InterpreterError extends ODError<TInterpreterErrors> {
  constructor({ code, message }: InterpreterErrorConstructorParameters) {
    super({ code, message });
  }
}
