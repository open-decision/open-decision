import { z } from "zod";
import { DecisionTreeModel } from "@open-decision/models";
import { AuthHeader } from "@open-decision/api-helpers";

export const getTreesInput = z.object({
  headers: AuthHeader,
  query: DecisionTreeModel.pick({ name: true, status: true })
    .partial()
    .optional(),
});

export type TGetTreesInput = z.infer<typeof getTreesInput>;
