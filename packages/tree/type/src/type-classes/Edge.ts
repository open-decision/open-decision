import { z } from "zod";

export const Type = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string().optional(),
  type: z.any(),
  data: z.unknown(),
});

export const Record = z.record(Type);

export type TEdge = z.infer<typeof Type>;
export type TRecord = z.infer<typeof Record>;
