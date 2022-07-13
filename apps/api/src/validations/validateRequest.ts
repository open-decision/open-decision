import { ZodSchema } from "zod";
import { Request } from "express";
import { APIError } from "@open-decision/type-classes";

const validateRequest =
  <TSchema>(schema: ZodSchema<TSchema>) =>
  async (req: Request): Promise<TSchema> => {
    const validationResult = await schema.safeParseAsync(req);

    if (!validationResult.success) {
      throw new APIError<TSchema>({
        code: "VALIDATION_ERROR",
        message: "The validation of the inputs failed",
        errors: validationResult.error.format(),
      });
    }

    return validationResult.data;
  };

export default validateRequest;
