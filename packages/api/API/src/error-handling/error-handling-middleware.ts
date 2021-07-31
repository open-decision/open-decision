import express, { NextFunction, Request, Response, response } from "express";
import { BaseError } from "./base-error";

export function logError(err: BaseError) {
  console.error(err);
}

export function logErrorMiddleware(
  err: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logError(err);
  next(err);
}

export function returnError(
  err: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (Object.keys(err.additionalErrorData).length === 0) {
    res.status(err.statusCode || 500).json({
      errorType: err.name,
      errorDescription: err.message,
    });
  } else {
    res.status(err.statusCode || 500).json({
      errorType: err.name,
      description: err.message,
      errors: err.additionalErrorData,
    });
  }
}

function isOperationalError(error: BaseError) {
  if (error instanceof BaseError) {
    return error.isOperational;
  }
  return false;
}
