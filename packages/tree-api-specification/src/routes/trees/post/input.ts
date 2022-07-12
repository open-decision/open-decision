import { z } from "zod";

export const createTreeInput = z.object({
  body: z.object({
    name: z.string(),
  }),
});

export type TCreateTreeInput = z.infer<typeof createTreeInput>;
