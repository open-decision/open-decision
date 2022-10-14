import { z } from "zod";
import { BaseVariableType } from "@open-decision/variable-plugins-helpers";

export const Value = z.object({ id: z.string().uuid(), text: z.string() });

export const SelectVariable = BaseVariableType.extend({
  type: z.literal("select"),
  values: z.array(Value).default([]),
});
