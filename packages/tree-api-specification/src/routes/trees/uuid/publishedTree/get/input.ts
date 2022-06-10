import { AuthHeader } from "@open-decision/api-helpers";
import { z } from "zod";

export const getPublishedTreeInput = z.object({
  params: z.object({ treeUuid: z.string().uuid() }),
  headers: AuthHeader,
});

export type TGetPublishedTreeInput = z.infer<typeof getPublishedTreeInput>;
