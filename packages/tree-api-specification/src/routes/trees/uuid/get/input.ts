import { AuthHeader } from "@open-decision/api-helpers";
import { z } from "zod";

export const getTreeInput = z.object({
  headers: AuthHeader,
  params: z.object({ uuid: z.string().uuid() }),
});

export type TGetTreeInput = z.infer<typeof getTreeInput>;
