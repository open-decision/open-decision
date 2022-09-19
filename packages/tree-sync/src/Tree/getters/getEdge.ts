import { pick } from "remeda";
import { Edge, Tree } from "../type-classes";

export const getEdge = (tree: Tree.TTree) => (edgeId: string) => {
  return tree.edges?.[edgeId];
};

export const getEdges =
  (tree: Tree.TTree) =>
  (edgeIds?: string[]): Edge.TEdgesRecord | undefined => {
    if (!tree.edges) return undefined;

    if (!edgeIds) return tree.edges;

    const edges = pick(tree.edges, edgeIds);
    if (!edges) return undefined;

    return edges;
  };
