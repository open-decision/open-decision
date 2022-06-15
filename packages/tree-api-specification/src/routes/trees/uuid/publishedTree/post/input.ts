import { AuthHeader } from "@open-decision/api-helpers";
import { z } from "zod";

export const createPublishedTreeInput = z.object({
  headers: AuthHeader,
  params: z.object({ treeUuid: z.string().uuid() }),
  body: z.object({ name: z.string() }),
});

export type TCreatePublishedTreeInput = z.infer<
  typeof createPublishedTreeInput
>;
