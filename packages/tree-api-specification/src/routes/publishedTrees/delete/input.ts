import { z } from "zod";

export const deletePublishedTreeInput = z.object({
  params: z.object({ uuid: z.string().uuid() }),
});

export type TDeletePublishedTreeInput = z.infer<
  typeof deletePublishedTreeInput
>;
