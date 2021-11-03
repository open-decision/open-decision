import { HTTPStatusCodes, CustomErrorInterface } from "./types";

export class BaseError extends Error {
  statusCode: HTTPStatusCodes;
  isOperational: boolean;
  additionalErrorData: object;

  constructor({
    name,
    message,
    additionalErrorData = {},
    statusCode = HTTPStatusCodes.INTERNAL_SERVER,
    isOperational = true,
  }: CustomErrorInterface) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.additionalErrorData = additionalErrorData;

    // Error.captureStackTrace(this);
  }
}
