import { z } from "zod";
import { DecisionTreeModel } from "@open-decision/models";

export const getTreesInput = z.object({
  query: DecisionTreeModel.pick({ name: true, status: true })
    .partial()
    .optional(),
});

export type TGetTreesInput = z.infer<typeof getTreesInput>;
