import { ExceptionCodes } from "./ExceptionCodes";

export type ODExceptionConstructorParameters = {
  code: ExceptionCodes;
  additionalData?: {};
} & Omit<Error, "name">;

export class ODException extends Error {
  readonly code: ExceptionCodes;
  readonly timestamp?: number;
  readonly additionalData?: {};

  constructor({
    code,
    additionalData,
    message,
  }: ODExceptionConstructorParameters) {
    super(message);

    this.code = code;
    this.timestamp = Date.now();
    this.name = "ODError";
    this.additionalData = additionalData;
  }
}
