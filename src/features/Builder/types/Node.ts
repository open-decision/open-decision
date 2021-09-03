import { pipe } from "fp-ts/function";
import * as T from "io-ts";
import { nanoid } from "nanoid/non-secure";
import { Path } from "./Path";
import { TTree } from "./Tree";
import * as Record from "fp-ts/Record";
import { not } from "fp-ts/Predicate";

const Coordinates = T.type({
  x: T.number,
  y: T.number,
});

export const NodeData = T.type({
  label: T.string,
  inputs: T.record(T.string, Path.Type),
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
};

export type TNode = T.TypeOf<typeof NodeType>;
export type TNodeData = T.TypeOf<typeof NodeData>;
export type TNodesRecord = T.TypeOf<typeof NodeRecord>;
