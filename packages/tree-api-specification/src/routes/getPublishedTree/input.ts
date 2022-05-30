import { z } from "zod";

export const getPublishedTreeInput = z.object({
  params: z.object({
    publishedTreeUuid: z.string().uuid(),
  }),
});

export type TGetPublishedTreeInput = z.infer<typeof getPublishedTreeInput>;
