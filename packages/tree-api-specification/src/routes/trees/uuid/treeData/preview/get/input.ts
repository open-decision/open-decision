import { z } from "zod";

export const getTreePreviewInput = z.object({
  params: z.object({ uuid: z.string().uuid() }),
});

export type TGetTreePreviewInput = z.infer<typeof getTreePreviewInput>;
