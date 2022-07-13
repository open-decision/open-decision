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
  isOperational: boolean;
  declare errors?: ZodFormattedError<TSchema>;

  constructor({
    code,
    message,
    isOperational = true,
    errors,
  }: ODAPIErrorConstructorParameters<TSchema>) {
    super({ code, message });

    this.errors = errors;
    this.statusCode = APIErrors[code];
    this.isOperational = isOperational;
  }
}

export const isAPIError = (error: any): error is APIError =>
  !!APIErrors[error?.code];

// export type ODAPIValidationErrorConstructorParameters = {
//   zodError: ODValidationErrorConstructorParameters["zodError"];
// };

// export class APIValidationError extends APIError {
//   declare zodError: ZodError;
//   constructor({ zodError }: ODAPIValidationErrorConstructorParameters) {
//     super({
//       code: "VALIDATION_ERROR",
//       message: "The validation of the inputs failed",
//     });

//     this.zodError = zodError;
//   }
// }
