import { z } from "zod";

export const Type = z.object({
  id: z.string().uuid(),
  type: z.string(),
  data: z.unknown(),
});

export const Record = z.record(Type);

export type TCondition = z.infer<typeof Type>;
export type TRecord = z.infer<typeof Record>;
