import { z } from "zod";

export const deleteTreeInput = z.object({
  params: z.object({ uuid: z.string().uuid() }),
});

export type TDeleteTreeInput = z.infer<typeof deleteTreeInput>;
