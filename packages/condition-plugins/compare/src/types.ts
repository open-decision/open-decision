import { Condition } from "@open-decision/type-classes";
import { z } from "zod";

export const type = "compare" as const;

export const Type = z.object({
  type: z.literal("compare"),
  inputId: z.string().uuid(),
  valueId: z.string().uuid(),
});

export type TCompareCondition = z.infer<typeof Type>;
