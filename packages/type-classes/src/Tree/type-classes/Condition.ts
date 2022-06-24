import { z } from "zod";

export const Types = z.enum(["select", "always"]);

export const Type = z.object({
  id: z.string().uuid(),
  type: z.string().optional(),
  inputId: z.string().uuid().optional(),
});

export const Record = z.record(Type);

export type TCondition = z.infer<typeof Type>;
export type TRecord = z.infer<typeof Record>;
