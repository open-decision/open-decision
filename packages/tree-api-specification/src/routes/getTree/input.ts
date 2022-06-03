import { z } from "zod";
import { AuthHeader } from "../shared";

export const getTreeInput = z.object({
  params: z.object({
    treeUuid: z.string().uuid(),
  }),
  headers: AuthHeader,
});

export type TGetTreeInput = z.infer<typeof getTreeInput>;
