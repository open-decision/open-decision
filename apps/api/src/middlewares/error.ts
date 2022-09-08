import httpStatus from "http-status";
import config from "../config/config";
import { NextFunction, Request, Response } from "express";
import { Prisma } from "@open-decision/prisma";
import http from "http";
import { APIError } from "@open-decision/type-classes";
import { de } from "@open-decision/translations";

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
        err.message ??
        de.common.errors[err.code ?? "INTERNAL_SERVER_ERROR"].long,
      // if the occuring error is not an API Error, it should not be an operational error
      isOperational: false,
      stack: err.stack,
    });
  }

  next(error);
};

export const errorHandler = (
  err: APIError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.locals.errorMessage =
    err.message ?? de.common.errors[err.code ?? "INTERNAL_SERVER_ERROR"].long;

  if (config.NODE_ENV === "production" && !err.isOperational) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      statusCode: 500,
      message: http.STATUS_CODES[httpStatus.INTERNAL_SERVER_ERROR],
    });
  }

  return res.status(err.statusCode).send(err);
};
