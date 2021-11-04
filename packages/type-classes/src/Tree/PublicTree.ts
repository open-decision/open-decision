import * as Node from "../Node/PublicNode";
import { z } from "zod";

// ------------------------------------------------------------------
// Tree State

export const Type = z.object({
  id: z.string(),
  treeName: z.string(),
  checksum: z.string(),
  nodes: Node.Record,
  startNode: z.string(),
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
