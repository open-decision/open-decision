import { APIErrors } from "./ErrorCodes";
import { ODError, ODErrorConstructorParameters } from "./ODError";

export type ODAPIErrorConstructorParameters = Omit<
  ODErrorConstructorParameters,
  "code"
> & {
  code: `${keyof typeof APIErrors}`;
};

export class APIError extends ODError {
  statusCode: APIErrors;

  constructor({ code, message }: ODAPIErrorConstructorParameters) {
    super({ code: `API_${code}`, message });

    this.statusCode = APIErrors[code];
  }
}
