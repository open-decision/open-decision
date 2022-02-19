import * as PublicNode from "../Node/PublicNode";
import { z } from "zod";

// ------------------------------------------------------------------
// Tree State

export const TreeData = z.object({
  startNode: z.string().uuid(),
  nodes: PublicNode.Record,
});

export const Tags = z.object({
  name: z.string(),
  color: z.string().regex(/^#[0-9a-f]{3,6}$/i),
  type: z.enum(["system", "user"]),
});

export const Type = z.object({
  id: z.number(),
  name: z.string().min(1),
  treeData: TreeData,
  tags: z.array(Tags),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// ------------------------------------------------------------------
// Tree Methods

export {
  circularConnection,
  getChildren,
  getConnectableNodes,
  getParents,
  getPaths,
  getTreeHash,
} from "./shared";

// ------------------------------------------------------------------
// Types

export type TTree = z.infer<typeof Type>;
