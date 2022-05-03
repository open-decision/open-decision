import { z } from "zod";

export const SelectCondition = z.object({
  type: z.enum(["select"]),
  id: z.string().uuid(),
  inputId: z.string().uuid(),
  answerId: z.string().uuid(),
});

export const Type = SelectCondition;

export const Record = z.record(Type);

export type TSelectCondition = z.infer<typeof SelectCondition>;
export type TCondition = z.infer<typeof Type>;
export type TRecord = z.infer<typeof Record>;
