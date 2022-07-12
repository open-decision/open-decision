import { z } from "zod";

export const getPublishedTreesInput = z.object({
  params: z.object({ uuid: z.string() }),
});

export type TGetPublishedTreesInput = z.infer<typeof getPublishedTreesInput>;
