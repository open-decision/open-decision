import { z } from "zod";

export const Type = z.object({
  id: z.string().uuid(),
  type: z.string(),
  data: z.any(),
});

export const Record = z.record(Type);

export type TInput = z.infer<typeof Type>;

export type TRecord = z.infer<typeof Record>;
