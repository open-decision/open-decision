import { AuthHeader } from "@open-decision/api-helpers";
import { z } from "zod";

export const getPublishedTreeOfTreeInput = z.object({
  params: z.object({ treeUuid: z.string().uuid() }),
  headers: AuthHeader,
});

export type TGetPublishedTreeOfTreeInput = z.infer<
  typeof getPublishedTreeOfTreeInput
>;
