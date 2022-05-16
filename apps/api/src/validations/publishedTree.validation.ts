import { z } from "zod";

export const getPublishedTree = z.object({
  params: z.object({
    publishedTreeUuid: z.string().uuid(),
  }),
});
