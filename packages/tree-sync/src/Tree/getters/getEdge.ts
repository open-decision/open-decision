import { ODProgrammerError } from "@open-decision/type-classes";
import { pick } from "remeda";
import { Edge, Tree } from "../type-classes";

/**
 * Returns a single edge from the tree.
 * @throws {ODProgrammerError} if the edge does not exist
 */
export const getEdge = (tree: Tree.TTree) => (edgeId: string) => {
  const edge = tree.edges?.[edgeId];

  if (!edge)
    throw new ODProgrammerError({
      code: "ENTITY_NOT_FOUND",
      message: `The edge of id ${edgeId} could not be found. Please check that the id is correct.
        Is the passed id actually a valid edge id?`,
    });

  return edge;
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
