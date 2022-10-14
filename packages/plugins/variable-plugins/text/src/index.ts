import { z } from "zod";
import { BaseVariableType } from "@open-decision/variable-plugins-helpers";

export const TextVariable = BaseVariableType.extend({
  type: z.literal("text"),
  value: z.string().optional(),
});
