import { pipe } from "fp-ts/function";
import * as T from "io-ts";
import { nanoid } from "nanoid/non-secure";
import * as Record from "fp-ts/Record";
import { not } from "fp-ts/Predicate";
import * as Option from "fp-ts/Option";
import * as Array from "fp-ts/Array";

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

export const getParentNodes = (nodeId: string) => (nodes: TNodesRecord) =>
  pipe(
    nodes,
    Record.toArray,
    Array.chain(([, node]) =>
      pipe(
        node.data.relations,
        Record.toArray,
        Array.filter(([, relation]) => relation.target === nodeId),
        Array.map(() => node.id)
      )
    )
  );

export const getChildNodes = (nodeId: string) => (nodes: TNodesRecord) =>
  pipe(nodes[nodeId], (node) =>
    pipe(
      node.data.relations,
      Record.toArray,
      Array.filter(([, relation]) => !!relation.target),
      Array.map(([, relation]) => relation.target)
    )
  );

export const getPossiblePaths = (nodeId: string) => (nodes: TNodesRecord) => {
  const parentNodes = getParentNodes(nodeId)(nodes);

  return pipe(
    nodes,
    Record.filter((node) => {
      return node.id !== nodeId && !parentNodes.includes(node.id);
    }),
    Record.map((node) => ({ target: node.id, label: node.data.label }))
  );
};

export function createPath(path: Omit<TRelation, "id">): TRelation {
  return {
    id: nanoid(5),
    value: "",
    ...path,
  };
}

export const updatePath =
  (path: TRelation, nodeId: string) =>
  (nodes: TNodesRecord): TRelation | undefined =>
    pipe(
      Option.fromNullable(nodes[nodeId].data.relations[path.id]),
      Option.fold(
        () => undefined,
        (oldPath) => ({ ...oldPath, ...path })
      )
    );

export const getPath =
  (nodeId: string, relationId: string) => (nodes: TNodesRecord) =>
    pipe(nodes[nodeId].data.relations[relationId], Option.fromNullable);

export const Data = T.type({
  label: T.string,
  relations: T.record(T.string, Relation),
  content: T.unknown,
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

export const hasPath = (node: TNode, targetId: string) =>
  pipe(
    node.data.relations,
    Record.filter((relation) => relation.target === targetId),
    not(Record.isEmpty)
  );

export const NodeRecord = T.record(T.string, Type);

export function createNewNode(
  node: Omit<TNode, "id" | "type" | "data"> & { data?: Partial<TNodeData> }
): TNode {
  return {
    id: nanoid(5),
    type: "default",
    ...node,
    data: {
      relations: {},
      content: [],
      label: "Neuer Knoten",
      ...node.data,
    },
  };
}

export const getNode = (nodeId: string) => (nodes: TNodesRecord) => {
  nodes[nodeId];
};

export type TNode = T.TypeOf<typeof Type>;
export type TNodeData = T.TypeOf<typeof Data>;
export type TNodesRecord = T.TypeOf<typeof NodeRecord>;
export type TRelation = T.TypeOf<typeof Relation>;
