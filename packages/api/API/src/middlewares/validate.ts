import { z, ZodError, ZodErrorMap, ZodIssue, ZodObject, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import * as R from "remeda";
import { ApiError } from "../utils/ApiError";
import { HTTPStatusCodes, CustomErrorInterface } from "../types/types";

const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const validationResult = schema.safeParse(req);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues
        .map(
          (details: ZodIssue) =>
            `${details.path[details.path.length]}: ${details.message}`
        )
        .join(", ");
      return next(
        new ApiError({
          statusCode: HTTPStatusCodes.BAD_REQUEST,
          message: errorMessage,
        })
      );
    }
    Object.assign(res.locals, validationResult.data);
    return next();
  };

export default validate;
