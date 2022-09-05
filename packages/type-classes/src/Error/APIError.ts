import { APIErrors } from "./ErrorCodes";
import { ODError, ODErrorConstructorParameters } from "./ODError";
import { ZodFormattedError } from "zod";

export type ODAPIErrorConstructorParameters<TSchema> =
  ODErrorConstructorParameters<keyof typeof APIErrors> & {
    isOperational?: boolean;
    errors?: ZodFormattedError<TSchema>;
  };

export class APIError<TSchema = any> extends ODError<keyof typeof APIErrors> {
  statusCode: APIErrors;
  errors?: ZodFormattedError<TSchema>;

  constructor({
    code,
    message,
    isOperational = true,
    errors,
  }: ODAPIErrorConstructorParameters<TSchema>) {
    super({ code, message, isOperational });

    this.errors = errors;
    this.statusCode = APIErrors[code];
  }
}

export const isAPIError = (error: any): error is APIError =>
  !!APIErrors[error?.code];
