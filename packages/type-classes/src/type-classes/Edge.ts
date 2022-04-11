import { z } from "zod";

export const Type = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.enum(["default"]),
  conditionId: z.string().optional(),

  // data: z.object({
  //   conditionId: z.string().optional(),
  // }),
});

export const Record = z.record(Type);

export type TEdge = z.infer<typeof Type>;
export type TEdgesRecord = z.infer<typeof Record>;
