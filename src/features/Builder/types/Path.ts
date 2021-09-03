import * as T from "io-ts";
import { TNode } from "./Node";
import { TTree } from "./Tree";
import * as Record from "fp-ts/Record";
import { pipe } from "fp-ts/function";
import { nanoid } from "nanoid/non-secure";
import { fromNullable } from "fp-ts/lib/Option";

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

const getPath = (nodeId: string, inputId: string) => (tree: TTree) =>
  pipe(tree.nodes[nodeId].data.inputs[inputId], fromNullable);

export const Path = {
  Type: PathType,
  getPossiblePaths,
  createPath,
  getPath,
};

export type TPath = T.TypeOf<typeof PathType>;
