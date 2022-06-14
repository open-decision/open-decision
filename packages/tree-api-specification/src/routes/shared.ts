import { z } from "zod";
import { DecisionTreeModel, PublishedTreeModel } from "@open-decision/models";

export const TreeOutput = DecisionTreeModel.omit({
  treeData: true,
  yDocument: true,
}).extend({
  publishedTrees: z.array(z.object({ uuid: z.string().uuid() })),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const PublishedTreeOutput = PublishedTreeModel.extend({
  createdAt: z.string(),
});
