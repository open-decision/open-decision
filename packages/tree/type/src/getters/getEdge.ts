import { ODProgrammerError } from "@open-decision/type-classes";
import { pick } from "remeda";
import { Tree } from "../type-classes";

/**
 * Returns a single edge from the tree.
 * @throws {ODProgrammerError} if the edge does not exist
 */
export const getEdge = (tree: Tree.TTree) => (edgeId: string) => {
  const edge = tree.edges?.[edgeId];

  if (!edge)
    return new ODProgrammerError({
      code: "ENTITY_NOT_FOUND",
      message: "Tried to get an edge that does not exist on the tree.",
    });

  return edge;
};

export const getEdges =
  <TTree extends Tree.TTree>(tree: TTree) =>
  (edgeIds?: string[]): TTree["edges"] | undefined => {
    if (!tree.edges) return undefined;

    if (!edgeIds) return tree.edges;

    const edges = pick(tree.edges, edgeIds);
    if (!edges) return undefined;

    return edges;
  };
