import httpStatus from "http-status";
import httpMocks from "node-mocks-http";
import { errorConverter, errorHandler } from "../../../src/middlewares/error";
import ApiError from "../../../src/utils/ApiError";
import config from "../../../src/config/config";
import { logger } from "../../../src/config/logger";
import { jest } from "@jest/globals";
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime";

describe("Error middlewares", () => {
  describe("Error converter", () => {
    test("should return the same ApiError object it was called with", () => {
      const error = new ApiError({
        statusCode: httpStatus.BAD_REQUEST,
        message: "Any error",
      });
      const next = jest.fn();

      errorConverter(
        error,
        httpMocks.createRequest(),
        httpMocks.createResponse(),
        next
      );

      expect(next).toHaveBeenCalledWith(error);
    });

    test("should convert an Error to ApiError and preserve its status and message", () => {
      const error = new Error("Any error") as ApiError;
      error.statusCode = httpStatus.BAD_REQUEST;
      const next = jest.fn();

      errorConverter(
        error,
        httpMocks.createRequest(),
        httpMocks.createResponse(),
        next
      );

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: error.statusCode,
          message: error.message,
          isOperational: false,
        })
      );
    });

    test("should convert an Error without status to ApiError with status 500", () => {
      const error = new Error("Any error");
      const next = jest.fn();

      errorConverter(
        error,
        httpMocks.createRequest(),
        httpMocks.createResponse(),
        next
      );

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: httpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          isOperational: false,
        })
      );
    });

    test("should convert an Error without message to ApiError with default message of that http status", () => {
      const error = new Error() as ApiError;
      error.statusCode = httpStatus.BAD_REQUEST;
      const next = jest.fn();

      errorConverter(
        error,
        httpMocks.createRequest(),
        httpMocks.createResponse(),
        next
      );

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: error.statusCode,
          message: httpStatus[error.statusCode],
          isOperational: false,
        })
      );
    });

    test("should convert a Prisma error to ApiError with status 400 and preserve its message", () => {
      const error = new PrismaClientKnownRequestError(
        "Prisma Error",
        "1000",
        "v2.4"
      );
      const next = jest.fn();

      errorConverter(
        error,
        httpMocks.createRequest(),
        httpMocks.createResponse(),
        next
      );

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: httpStatus.BAD_REQUEST,
          message: error.message,
          isOperational: false,
        })
      );
    });

    test("should convert any other object to ApiError with status 500 and its message", () => {
      const error = {};
      const next = jest.fn();

      errorConverter(
        error,
        httpMocks.createRequest(),
        httpMocks.createResponse(),
        next
      );

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: httpStatus.INTERNAL_SERVER_ERROR,
          message: httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
          isOperational: false,
        })
      );
    });
  });

  describe("Error handler", () => {
    beforeEach(() => {
      jest.spyOn(logger, "error").mockImplementation(jest.fn());
    });

    test("should send proper error response and put the error message in res.locals", () => {
      const error = new ApiError({
        statusCode: httpStatus.BAD_REQUEST,
        message: "Any error",
      });
      const res = httpMocks.createResponse();
      const sendSpy = jest.spyOn(res, "send");
      const next = jest.fn();
      errorHandler(error, httpMocks.createRequest(), res, next);

      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          code: error.statusCode,
          message: error.message,
        })
      );
      expect(res.locals.errorMessage).toBe(error.message);
    });

    test("should put the error stack in the response if in development mode", () => {
      config.NODE_ENV = "development";
      const error = new ApiError({
        statusCode: httpStatus.BAD_REQUEST,
        message: "Any error",
      });
      const res = httpMocks.createResponse();
      const sendSpy = jest.spyOn(res, "send");
      const next = jest.fn();
      errorHandler(error, httpMocks.createRequest(), res, next);

      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          code: error.statusCode,
          message: error.message,
          stack: error.stack,
        })
      );
      config.NODE_ENV = process.env.NODE_ENV as typeof config.NODE_ENV;
    });

    test("should send internal server error status and message if in production mode and error is not operational", () => {
      config.NODE_ENV = "production";
      const error = new ApiError({
        statusCode: httpStatus.BAD_REQUEST,
        message: "Any error",
        isOperational: false,
      });
      const res = httpMocks.createResponse();
      const sendSpy = jest.spyOn(res, "send");
      const next = jest.fn();
      errorHandler(error, httpMocks.createRequest(), res, next);

      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          code: httpStatus.INTERNAL_SERVER_ERROR,
          message: httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
        })
      );
      expect(res.locals.errorMessage).toBe(error.message);
      config.NODE_ENV = process.env.NODE_ENV as typeof config.NODE_ENV;
    });

    test("should preserve original error status and message if in production mode and error is operational", () => {
      config.NODE_ENV = "production";
      const error = new ApiError({
        statusCode: httpStatus.BAD_REQUEST,
        message: "Any error",
      });
      const res = httpMocks.createResponse();
      const sendSpy = jest.spyOn(res, "send");
      const next = jest.fn();
      errorHandler(error, httpMocks.createRequest(), res, next);

      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          code: error.statusCode,
          message: error.message,
        })
      );
      config.NODE_ENV = process.env.NODE_ENV as typeof config.NODE_ENV;
    });
  });
});
