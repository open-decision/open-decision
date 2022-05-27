import { ZodIssue, ZodSchema, SafeParseSuccess } from "zod";
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";

const validateRequest =
  <TSchema>(schema: ZodSchema<TSchema>) =>
  async (req: Request): Promise<TSchema> => {
    const validationResult = await schema.safeParseAsync(req);

    if (!validationResult.success) {
      const errors = validationResult.error.format();

      throw new ApiError({
        statusCode: httpStatus.BAD_REQUEST,
        message: JSON.stringify(errors),
      });
    }

    return validationResult.data;
  };

export default validateRequest;
