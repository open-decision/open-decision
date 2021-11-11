import * as BuilderNode from "../Node/BuilderNode";
import { z } from "zod";
import { v4 as uuidV4 } from "uuid";
import { BaseTree } from "./shared";

export const Type = BaseTree.extend({
  selectedNodeId: z.string().optional(),
  selectedRelationId: z.string().optional(),
  startNode: z.string().optional(),
  nodes: BuilderNode.Record,
});

export function create(name: string): TTree {
  const newTree = {
    id: uuidV4(),
    nodes: {},
    treeName: name,
  };

  return newTree;
}

export {
  circularConnection,
  getChildren,
  getConnectableNodes,
  getParents,
  getPaths,
} from "./shared";

export type TTree = z.infer<typeof Type>;
