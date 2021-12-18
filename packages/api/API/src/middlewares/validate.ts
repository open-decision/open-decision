import { ZodIssue, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";

const validate =
  (schema: ZodSchema<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const validationResult = await schema.safeParseAsync(req);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues
        .map(
          (details: ZodIssue) =>
            `${details.path[details.path.length - 1]} : ${details.message}`
        )
        .join(", ");
      return next(
        new ApiError({
          statusCode: httpStatus.BAD_REQUEST,
          message: errorMessage,
        })
      );
    }
    res.locals = {
      ...validationResult.data.body,
      ...validationResult.data.params,
      ...validationResult.data.cookies,
      ...validationResult.data.query,
    };

    return next();
  };

export default validate;
