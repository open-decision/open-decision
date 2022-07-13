import httpStatus from "http-status";
import config from "../config/config";
import { logger } from "../config/logger";
import { NextFunction, Request, Response } from "express";
import { Prisma } from "@open-decision/prisma";
import http from "http";
import { APIError } from "@open-decision/type-classes";

export const errorConverter = (
  err: any,
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  let error = err;
  let code;
  if (!(error instanceof APIError)) {
    if (
      error.statusCode ||
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientUnknownRequestError ||
      error instanceof Prisma.PrismaClientValidationError
    ) {
      code = "BAD_REQUEST";
    }

    error = new APIError({
      code: code ?? "INTERNAL_SERVER_ERROR",
      message:
        "The server encountered an unknown error. This has been automatically recorded.",
      // if the occuring error is not an API Error, it should not be an operational error
      isOperational: false,
      stack: err.stack,
    });
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (
  err: APIError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let { statusCode, message } = err;
  const { code, errors } = err;

  if (config.NODE_ENV === "production" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message =
      http.STATUS_CODES[httpStatus.INTERNAL_SERVER_ERROR] ||
      "We experienced an internal server errror.";
  }

  res.locals.errorMessage = err.message;

  const response = {
    code,
    statusCode,
    message,
    errors,
    ...(config.NODE_ENV === "development" && { stack: err.stack }),
  };

  if (config.NODE_ENV === "development") {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};
