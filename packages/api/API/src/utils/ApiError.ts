import { CustomErrorInterface } from "../types/types";
import httpStatus from "http-status";

class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  additionalErrorData: object;
  stack?: string;
  constructor({
    name = "",
    message,
    additionalErrorData = {},
    statusCode = httpStatus.INTERNAL_SERVER_ERROR,
    isOperational = true,
    stack = "",
  }: CustomErrorInterface) {
    super(message);

    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.additionalErrorData = additionalErrorData;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
