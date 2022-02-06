import * as BuilderNode from "../Node/BuilderNode";
import { z } from "zod";
import { BaseTree } from "./shared";

export const Type = BaseTree.extend({
  treeData: BuilderNode.Record,
  selectedNodeId: z.string().optional(),
  selectedRelationId: z.string().optional(),
});

export function create(name: string): TTree {
  const newTree = {
    treeData: {},
    name,
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
