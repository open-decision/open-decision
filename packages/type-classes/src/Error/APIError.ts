import { APIErrors } from "./ErrorCodes";
import { ODError, ODErrorConstructorParameters } from "./ODError";

export type ODAPIErrorConstructorParameters = Omit<
  ODErrorConstructorParameters,
  "code"
> & {
  code: `${keyof typeof APIErrors}`;
  isOperational?: boolean;
};

export class APIError extends ODError {
  statusCode: APIErrors;
  isOperational: boolean;

  constructor({
    code,
    message,
    isOperational = true,
  }: ODAPIErrorConstructorParameters) {
    const prefixedCode = (
      code.includes("API") ? code : `API_${code}`
    ) as `API_${typeof code}`;
    super({ code: prefixedCode, message });

    this.statusCode = APIErrors[code];
    this.isOperational = isOperational;
  }
}
