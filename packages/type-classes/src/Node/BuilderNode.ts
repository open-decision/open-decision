import { z } from "zod";
import { v4 as uuidV4 } from "uuid";
import * as BuilderRelation from "../Relation/BuilderRelation";
import * as PublicNode from "./PublicNode";

export const Coordinates = z.object({
  x: z.number(),
  y: z.number(),
});

export type TCoordinates = z.infer<typeof Coordinates>;

export const Type = PublicNode.Type.extend({
  name: z.string(),
  position: Coordinates,
  relations: z.record(BuilderRelation.Type),
});

export const Record = z.record(Type);

// ------------------------------------------------------------------
// Methods

export function create(node?: Partial<Omit<TNode, "id">>): TNode {
  return {
    id: uuidV4(),
    relations: {},
    name: "Neuer Knoten",

    position: { x: 0, y: 0 },
    ...node,
  };
}

export function createNewAssociatedNode(
  node: TNode,
  newNode: Partial<TNode>,
  nodeHeight = 80
): TNode {
  const deplacement = Object.values(node.relations).length;
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
