import { Tree } from "@open-decision/type-classes";
import { z } from "zod";

export const TreeOutput = z.object({
  uuid: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string(),
  status: z.enum(["ACTIVE", "ARCHIVED"]),
  name: z.string(),
  treeData: Tree.Type.nullable(),
  yDocument: z.string().nullable(),
  publishedTrees: z.array(z.object({ uuid: z.string().uuid() })),
});
