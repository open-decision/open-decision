import { z } from "zod";
import { BaseVariableType } from "@open-decision/plugins-variable-helpers";

export const TextVariable = BaseVariableType.extend({
  type: z.literal("text"),
  value: z.string().optional(),
});
