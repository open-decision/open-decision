import { AuthHeader } from "@open-decision/api-helpers";
import { z } from "zod";

export const getPublishedTreesInput = z.object({
  params: z.object({ uuid: z.string() }),
  headers: AuthHeader,
});

export type TGetPublishedTreesInput = z.infer<typeof getPublishedTreesInput>;
