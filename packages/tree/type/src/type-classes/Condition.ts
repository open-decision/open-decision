import { z } from "zod";

export const Type = z.object({
  id: z.string().uuid(),
  inputId: z.string().uuid().optional(),
  type: z.string(),
  data: z.any(),
});

export const Record = z.record(Type);

export type TCondition = z.infer<typeof Type>;
export type TRecord = z.infer<typeof Record>;
