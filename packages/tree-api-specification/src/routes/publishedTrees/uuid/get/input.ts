import { z } from "zod";

export const getPublishedTreeInput = z.object({
  params: z.object({ uuid: z.string() }),
});

export type TGetPublishedTreeInput = z.infer<typeof getPublishedTreeInput>;
