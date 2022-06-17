import { ZodSchema } from "zod";
import { Request } from "express";
import { APIError } from "@open-decision/type-classes";

const validateRequest =
  <TSchema>(schema: ZodSchema<TSchema>) =>
  async (req: Request): Promise<TSchema> => {
    const validationResult = await schema.safeParseAsync(req);

    if (!validationResult.success) {
      const errors = validationResult.error.format();

      throw new APIError({
        code: "VALIDATION_ERROR",
        message: JSON.stringify(errors),
      });
    }

    return validationResult.data;
  };

export default validateRequest;
