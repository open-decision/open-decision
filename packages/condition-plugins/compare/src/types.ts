import { Condition } from "@open-decision/type-classes";
import { z } from "zod";

export const type = "compare" as const;

export const CompareCondition = Condition.Type.extend({
  type: z.literal("compare"),
  inputId: z.string().uuid(),
  valueId: z.string().uuid(),
});

export type TCompareCondition = z.infer<typeof CompareCondition>;

export const isCompareCondition = (
  condition: Condition.TCondition
): condition is TCompareCondition => condition.type === "compare";
