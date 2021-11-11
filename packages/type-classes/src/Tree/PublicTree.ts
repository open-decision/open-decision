import { z } from "zod";
import { BaseTree } from "./shared";

// ------------------------------------------------------------------
// Tree State

export const Type = BaseTree.extend({
  checksum: z.number(),
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
