import { z } from "zod";

export const getTreeInput = z.object({
  params: z.object({
    treeUuid: z.string().uuid(),
  }),
});

export type TGetTreeInput = z.infer<typeof getTreeInput>;
