import { ODProgrammerError } from "@open-decision/type-classes";
import { z } from "zod";

export const parse =
  <TType extends z.ZodType>(Type: TType) =>
  (input: unknown) => {
    const parsedInput = Type.safeParse(input);

    if (!parsedInput.success) {
      console.error(parsedInput.error);
      throw new ODProgrammerError({
        code: "INVALID_ENTITY_CREATION",
        message:
          "The input could not be created. Please check that the data is correct.",
      });
    }

    return parsedInput.data;
  };
