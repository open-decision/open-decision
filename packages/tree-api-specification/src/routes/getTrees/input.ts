import { z } from "zod";
import { AuthHeader } from "../shared";
import { DecisionTreeModel } from "@open-decision/models/zod";

export const getTreesInput = z.object({
  headers: AuthHeader,
  query: DecisionTreeModel.pick({ name: true, status: true })
    .partial()
    .optional(),
});

export type TGetTreesInput = z.infer<typeof getTreesInput>;
