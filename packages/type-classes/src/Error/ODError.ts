import { ZodError, ZodIssue } from "zod";
import { ErrorCodes, ProgrammerErrors } from "./ErrorCodes";

export type ODErrorConstructorParameters = {
  code: ErrorCodes;
  additionalData?: {};
} & Omit<Error, "name">;

export class ODError extends Error {
  readonly code: ErrorCodes;
  readonly timestamp?: number;
  readonly additionalData?: {};

  constructor({ code, additionalData, message }: ODErrorConstructorParameters) {
    super(message);

    this.code = code;
    this.timestamp = Date.now();
    this.name = "ODError";
    this.additionalData = additionalData;
  }
}

export type ODProgrammerErrorConstructorParameters = Omit<
  ODErrorConstructorParameters,
  "code"
> & {
  link?: string;
  code: ProgrammerErrors;
};

export class ODProgrammerError extends ODError {
  link?: string;

  constructor({ link, ...args }: ODProgrammerErrorConstructorParameters) {
    super(args);

    this.link = link;
  }
}

export type ODValidationErrorConstructorParameters =
  ODErrorConstructorParameters & {
    zodError?: ZodError;
  };

export class ODValidationError extends ODError {
  issues?: ZodIssue[];

  constructor({ zodError, ...args }: ODValidationErrorConstructorParameters) {
    super(args);

    this.issues = zodError?.issues;
  }
}
