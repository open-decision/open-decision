import { z } from "zod";

export const getPublishedTreeOfTreeInput = z.object({
  params: z.object({ treeUuid: z.string().uuid() }),
});

export type TGetPublishedTreeOfTreeInput = z.infer<
  typeof getPublishedTreeOfTreeInput
>;
