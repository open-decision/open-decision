import * as T from "io-ts";
import { TNode } from "./Node";
import { TTree } from "./Tree";
import * as Record from "fp-ts/Record";
import { pipe } from "fp-ts/function";
import { nanoid } from "nanoid/non-secure";
import * as Option from "fp-ts/lib/Option";
import { Edge } from "./Edge";

const PathType = T.intersection([
  T.type({
    id: T.string,
  }),
  T.partial({
    value: T.string,
    target: T.string,
  }),
]);

const getPossiblePaths = (nodeId: string) => (tree: TTree) => {
  let parentNode: TNode | undefined;

  for (const edgeId in tree.edges) {
    const edge = tree.edges[edgeId];
    if (edge.target === nodeId) {
      parentNode = tree.nodes[edge.source];
    }
  }

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

const getPathByEdgeId = (edgeId: string) => (tree: TTree) => {
  const maybeEdge = Edge.getEdge(edgeId)(tree);
};

export const Path = {
  Type: PathType,
  getPossiblePaths,
  createPath,
  getPath,
  updatePath,
};

export type TPath = T.TypeOf<typeof PathType>;
