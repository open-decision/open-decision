import { z } from "zod";

export const Type = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.literal("default"),
  conditionId: z.string().optional(),
});

export const Record = z.record(Type);

export type TEdge = z.infer<typeof Type>;
export type TRecord = z.infer<typeof Record>;
