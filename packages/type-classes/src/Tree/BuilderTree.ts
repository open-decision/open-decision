import * as PublicTree from "./PublicTree";
import * as BuilderNode from "../Node/BuilderNode";
import { z } from "zod";
import { v4 as uuidV4 } from "uuid";

export const Type = PublicTree.Type.extend({
  selectedNodeId: z.string(),
  selectedRelationId: z.string(),
  nodes: BuilderNode.Record,
});

export function create(name: string): TTree {
  return {
    id: uuidV4(),
    checksum: "",
    nodes: {},
    startNode: "",
    treeName: name,
    selectedNodeId: "",
    selectedRelationId: "",
  };
}

export {
  circularConnection,
  getChildren,
  getConnectableNodes,
  getParents,
  getPaths,
} from "./shared";

export type TTree = z.infer<typeof Type>;
