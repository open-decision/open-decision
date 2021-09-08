import { pipe } from "fp-ts/function";
import * as T from "io-ts";
import { nanoid } from "nanoid/non-secure";
import { TTree } from "./Tree";
import * as Record from "fp-ts/Record";
import { not } from "fp-ts/Predicate";
import * as Option from "fp-ts/lib/Option";

export const Coordinates = T.type({
  x: T.number,
  y: T.number,
});

export const Path = T.intersection([
  T.type({
    id: T.string,
  }),
  T.partial({
    value: T.string,
    target: T.string,
  }),
]);

export const getParentNode = (nodeId: string) => (tree: TTree) => {
  let parentNode: TNode | undefined;

  for (const edgeId in tree.edges) {
    const edge = tree.edges[edgeId];
    if (edge.target === nodeId) {
      parentNode = tree.nodes[edge.source];
    }
  }

  return parentNode;
};

export const getPossiblePaths = (nodeId: string) => (tree: TTree) => {
  const parentNode = getParentNode(nodeId)(tree);

  return pipe(
    tree.nodes,
    Record.filter((node) => node.id !== nodeId && node.id !== parentNode?.id),
    Record.map((node) => ({ target: node.id, label: node.data.label }))
  );
};

export function createPath(path: Omit<TPath, "id">): TPath {
  return {
    id: nanoid(5),
    value: "",
    ...path,
  };
}

export const updatePath =
  (path: TPath, nodeId: string) =>
  (tree: TTree): TPath | undefined =>
    pipe(
      Option.fromNullable(tree.nodes[nodeId].data.inputs[path.id]),
      Option.fold(
        () => undefined,
        (oldPath) => ({ ...oldPath, ...path })
      )
    );

export const getPath = (nodeId: string, inputId: string) => (tree: TTree) =>
  pipe(tree.nodes[nodeId].data.inputs[inputId], Option.fromNullable);

export const Data = T.type({
  label: T.string,
  inputs: T.record(T.string, Path),
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
    node.data.inputs,
    Record.filter((input) => input.target === targetId),
    not(Record.isEmpty)
  );

export const NodeRecord = T.record(T.string, Type);

export function createNewNode(node: Omit<TNode, "id" | "type">): TNode {
  return {
    id: nanoid(5),
    type: "default",
    ...node,
  };
}

export const getNode = (nodeId: string) => (tree: TTree) => {
  tree.nodes[nodeId];
};

export type TNode = T.TypeOf<typeof Type>;
export type TNodeData = T.TypeOf<typeof Data>;
export type TNodesRecord = T.TypeOf<typeof NodeRecord>;
export type TPath = T.TypeOf<typeof Path>;
