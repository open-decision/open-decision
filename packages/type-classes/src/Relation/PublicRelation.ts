import { z } from "zod";

export const Type = z.object({
  id: z.string().uuid(),
  answer: z.string().min(1),
  target: z.string().min(1),
});

export type TRelation = z.infer<typeof Type>;
