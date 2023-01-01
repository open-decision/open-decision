import { DecisionTreeModel } from "@open-decision/models";
import { z } from "zod";

export const updateTreeInput = z.object({
  body: DecisionTreeModel.pick({
    name: true,
    status: true,
    hasPreview: true,
  }).partial(),
  params: z.object({ uuid: z.string().uuid() }),
});

export type TUpdateTreeInput = z.infer<typeof updateTreeInput>;
