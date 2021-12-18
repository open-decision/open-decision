import httpStatus from "http-status";
import config from "../config/config";
import { logger } from "../config/logger";
import ApiError from "../utils/ApiError";
import { NextFunction, Request, Response } from "express";
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime";
import http from "http";

export const errorConverter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    if (
      error.statusCode ||
      error instanceof PrismaClientKnownRequestError ||
      error instanceof PrismaClientUnknownRequestError ||
      error instanceof PrismaClientValidationError
    ) {
      statusCode = httpStatus.BAD_REQUEST;
    }

    const message = error.message || http.STATUS_CODES[statusCode];
    error = new ApiError({
      name: "ApiError",
      statusCode,
      message,
      // if the occuring error is not an API Error, it should not be an operational error
      isOperational: false,
      stack: err.stack,
    });
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode, message } = err;
  if (config.NODE_ENV === "production" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message =
      http.STATUS_CODES[httpStatus.INTERNAL_SERVER_ERROR] ||
      "We experienced an internal server errror.";
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.NODE_ENV === "development" && { stack: err.stack }),
  };

  if (config.NODE_ENV === "development") {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};
