import { z } from "zod";

export const createPublishedTreeInput = z.object({
  params: z.object({ treeUuid: z.string().uuid() }),
  body: z.object({ name: z.string() }),
});

export type TCreatePublishedTreeInput = z.infer<
  typeof createPublishedTreeInput
>;
