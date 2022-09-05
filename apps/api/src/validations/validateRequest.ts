import { ZodType } from "zod";
import { Request } from "express";
import { APIError, APIErrors } from "@open-decision/type-classes";

const validateRequest =
  <TSchema>(schema: ZodType<TSchema>) =>
  async (req: Request) => {
    const validationResult = await schema.safeParseAsync(req);

    if (!validationResult.success) {
      throw new APIError<TSchema>({
        code: "VALIDATION_ERROR",
        message: "The validation of the inputs failed",
        errors: validationResult.error.format(
          (issue) => issue.message as keyof typeof APIErrors
        ),
      });
    }

    return validationResult.data;
  };

export default validateRequest;
