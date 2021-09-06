import { pipe } from "fp-ts/function";
import * as T from "io-ts";
import { nanoid } from "nanoid/non-secure";
import { TTree } from "./Tree";
import * as Record from "fp-ts/Record";
import { not } from "fp-ts/Predicate";
import * as Option from "fp-ts/lib/Option";

const Coordinates = T.type({
  x: T.number,
  y: T.number,
});

const PathType = T.intersection([
  T.type({
    id: T.string,
  }),
  T.partial({
    value: T.string,
    target: T.string,
  }),
]);

const getParentNode = (nodeId: string) => (tree: TTree) => {
  let parentNode: TNode | undefined;

  for (const edgeId in tree.edges) {
    const edge = tree.edges[edgeId];
    if (edge.target === nodeId) {
      parentNode = tree.nodes[edge.source];
    }
  }

  return parentNode;
};

const getPossiblePaths = (nodeId: string) => (tree: TTree) => {
  const parentNode = getParentNode(nodeId)(tree);

  return pipe(
    tree.nodes,
    Record.filter((node) => node.id !== nodeId && node.id !== parentNode?.id),
    Record.map((node) => ({ target: node.id, label: node.data.label }))
  );
};

function createPath(path: Omit<TPath, "id">): TPath {
  return {
    id: nanoid(5),
    value: "",
    ...path,
  };
}

const updatePath =
  (path: TPath, nodeId: string) =>
  (tree: TTree): TPath | undefined =>
    pipe(
      Option.fromNullable(tree.nodes[nodeId].data.inputs[path.id]),
      Option.fold(
        () => undefined,
        (oldPath) => ({ ...oldPath, ...path })
      )
    );

const getPath = (nodeId: string, inputId: string) => (tree: TTree) =>
  pipe(tree.nodes[nodeId].data.inputs[inputId], Option.fromNullable);

export const NodeData = T.type({
  label: T.string,
  inputs: T.record(T.string, PathType),
  content: T.unknown,
});

const NodeType = T.intersection([
  T.type({
    id: T.string,
    position: Coordinates,
    type: T.string,
    data: NodeData,
  }),
  T.partial({
    isHidden: T.boolean,
    draggable: T.boolean,
    selectable: T.boolean,
    connectable: T.boolean,
  }),
]);

const hasPath = (node: TNode, targetId: string) =>
  pipe(
    node.data.inputs,
    Record.filter((input) => input.target === targetId),
    not(Record.isEmpty)
  );

const NodeRecord = T.record(T.string, NodeType);

function createNewNode(node: Omit<TNode, "id" | "type">): TNode {
  return {
    id: nanoid(5),
    type: "default",
    ...node,
  };
}

const getNode = (nodeId: string) => (tree: TTree) => {
  tree.nodes[nodeId];
};

export const Node = {
  Type: NodeType,
  Record: NodeRecord,
  Coordinates,
  Data: NodeData,
  createNewNode,
  getNode,
  hasPath,
  getPossiblePaths,
  createPath,
  getPath,
  updatePath,
  getParentNode,
};

export type TNode = T.TypeOf<typeof NodeType>;
export type TNodeData = T.TypeOf<typeof NodeData>;
export type TNodesRecord = T.TypeOf<typeof NodeRecord>;
export type TPath = T.TypeOf<typeof PathType>;
