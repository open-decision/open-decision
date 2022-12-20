import { z } from "zod";

export const Type = z.object({
  id: z.string().uuid(),
  type: z.string(),
  label: z.string().optional(),
  name: z.string().optional(),
  data: z.unknown(),
  required: z.boolean(),
});

export const Record = z.record(Type);

export type TInput = z.infer<typeof Type>;

export type TRecord = z.infer<typeof Record>;
