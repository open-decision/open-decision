import * as BuilderNode from "../Node/BuilderNode";
import { z } from "zod";
import { v4 as uuidV4 } from "uuid";
import { BaseTree } from "./shared";

export const Type = BaseTree.extend({
  nodes: BuilderNode.Record,
  selectedNodeId: z.string().optional(),
  selectedRelationId: z.string().optional(),
});

export function create(name: string): TTree {
  const newTree = {
    id: uuidV4(),
    nodes: {},
    treeName: name,
    startNode: "",
  } as TTree;

  return newTree;
}

export {
  circularConnection,
  getChildren,
  getConnectableNodes,
  getParents,
  getPaths,
  isUnique,
} from "./shared";

export type TTree = z.infer<typeof Type>;
