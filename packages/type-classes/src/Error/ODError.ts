import { ZodError, ZodIssue } from "zod";
import { ErrorCodes, ProgrammerErrors } from "./ErrorCodes";

export type ODErrorConstructorParameters<
  TErrorCodes extends ErrorCodes = ErrorCodes
> = {
  code: TErrorCodes;
  additionalData?: Record<string, unknown>;
} & Omit<Error, "name">;

export class ODError<
  TErrorCodes extends ErrorCodes = ErrorCodes
> extends Error {
  readonly code: TErrorCodes;
  readonly timestamp?: number;
  readonly additionalData?: Record<string, unknown>;

  constructor({
    code,
    additionalData,
    message,
  }: ODErrorConstructorParameters<TErrorCodes>) {
    super(message);

    this.code = code;
    this.timestamp = Date.now();
    this.name = "ODError";
    this.additionalData = additionalData;
  }
}

export type ODProgrammerErrorConstructorParameters = {
  link?: string;
  code: ProgrammerErrors;
  message?: string;
};

export class ODProgrammerError extends Error {
  link?: string;
  code?: ProgrammerErrors;

  constructor({ link, code, message }: ODProgrammerErrorConstructorParameters) {
    super(message);
    this.code = code;
    this.link = link;
  }
}

export type ODValidationErrorConstructorParameters<
  TErrorCodes extends ErrorCodes = ErrorCodes
> = ODErrorConstructorParameters<TErrorCodes> & {
  zodError: ZodError;
};

export class ODValidationError<
  TErrorCodes extends ErrorCodes = ErrorCodes
> extends ODError<TErrorCodes> {
  issues?: ZodIssue[];

  constructor({
    zodError,
    ...args
  }: ODValidationErrorConstructorParameters<TErrorCodes>) {
    super(args);

    this.issues = zodError?.issues;
  }
}
export const isODError = (error: any): error is ODError => !!error?.code;

export { ZodError } from "zod";
