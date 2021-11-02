import { pipe } from "fp-ts/function";
import * as T from "io-ts";
import { nanoid } from "nanoid/non-secure";
import * as Record from "fp-ts/Record";
import { not } from "fp-ts/Predicate";
import { Descendants } from "./NodeContent";

export const Coordinates = T.type({
  x: T.number,
  y: T.number,
});

export const Relation = T.intersection([
  T.type({
    id: T.string,
  }),
  T.partial({
    value: T.string,
    target: T.string,
  }),
]);

export const Data = T.type({
  label: T.string,
  relations: T.record(T.string, Relation),
  content: Descendants,
});

export const Type = T.intersection([
  T.type({
    id: T.string,
    position: Coordinates,
    type: T.string,
    data: Data,
  }),
  T.partial({
    isHidden: T.boolean,
    draggable: T.boolean,
    selectable: T.boolean,
    connectable: T.boolean,
  }),
]);

export const hasRelation = (node: TNode, targetId: string) =>
  pipe(
    node.data.relations,
    Record.filter((relation) => relation.target === targetId),
    not(Record.isEmpty)
  );

export const NodeRecord = T.record(T.string, Type);

export function create(
  node: Omit<TNode, "id" | "type" | "data"> & { data?: Partial<TNodeData> }
): TNode {
  return {
    id: nanoid(5),
    type: "customNode",
    ...node,
    data: {
      relations: {},
      content: [],
      label: "Neuer Knoten",
      ...node.data,
    },
  };
}

// ------------------------------------------------------------------
// Types

export type TNode = T.TypeOf<typeof Type>;
export type TNodeData = T.TypeOf<typeof Data>;
export type TNodesRecord = T.TypeOf<typeof NodeRecord>;
export type TRelation = T.TypeOf<typeof Relation>;
export type TCoordinates = T.TypeOf<typeof Coordinates>;
