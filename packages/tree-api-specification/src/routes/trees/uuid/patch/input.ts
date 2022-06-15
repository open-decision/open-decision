import { AuthHeader } from "@open-decision/api-helpers";
import { TreeStatus } from "@open-decision/models";
import { z } from "zod";

export const updateTreeInput = z.object({
  headers: AuthHeader,
  body: z
    .object({
      name: z.string(),
      status: z.enum(TreeStatus),
    })
    .partial(),
  params: z.object({ uuid: z.string().uuid() }),
});

export type TUpdateTreeInput = z.infer<typeof updateTreeInput>;
