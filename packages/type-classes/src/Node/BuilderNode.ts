import { z } from "zod";
import { v4 as uuidV4 } from "uuid";
import * as PublicNode from "./PublicNode";
import { DeepPartial } from "utility-types";

export const Coordinates = z.object({
  x: z.number(),
  y: z.number(),
});

export type TCoordinates = z.infer<typeof Coordinates>;

export const NodeData = z.object({
  name: z.string(),
  content: z.any().optional(),
  relations: z.array(z.string()),
});

export const Type = PublicNode.Type.extend({
  position: Coordinates,
  data: NodeData,
});

export const Record = z.array(Type);

// ------------------------------------------------------------------
// Methods

type nodeData = {
  position?: TNode["position"];
  data: {
    relations?: TNodeData["relations"];
    name?: string;
  };
} & DeepPartial<TNode>;

export function create({
  position = { x: 0, y: 0 },
  data: { relations = [], name = "" },
  ...node
}: nodeData): TNode {
  return {
    id: uuidV4(),
    data: {
      relations,
      name,
    },
    type: "customNode",
    position,
    ...node,
  };
}

export function createNewAssociatedNode(
  node: TNode,
  newNode: nodeData,
  nodeHeight = 80
): TNode {
  const deplacement = Object.values(node.data.relations).length;
  const position = {
    x: node.position.x + 5 * deplacement,
    y: node.position.y + nodeHeight + nodeHeight / 3 + 5 * deplacement,
  };

  return create({
    ...newNode,
    position,
  });
}

export { getNextNodeId, hasRelation } from "./shared";

export type TNode = z.infer<typeof Type>;
export type TNodesRecord = z.infer<typeof Record>;
export type TNodeData = z.infer<typeof NodeData>;
