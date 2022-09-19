import { ODProgrammerError } from "@open-decision/type-classes";
import { Tree, Edge } from "../type-classes";
import { isValidEdge } from "../validators";

/**
 * @summary Adds an edge to the tree under certain conditions.
 * @description
 * This functions adds a new edge if the following conditions are true:
 * - Does not connect to itself
 * - Edge does not already exist
 * - The Edge would not result in a circularly connected tree
 *
 * @param edge to be added to the tree
 */
export const addEdge = (tree: Tree.TTree) => (edge: Edge.TEdge) => {
  if (!tree.edges) tree.edges = {};

  if (!isValidEdge(tree)(edge))
    throw new ODProgrammerError({
      code: "TRYED_ADDING_INVALID_EDGE",
      message:
        "The edge you are trying to add is invalid. Make sure that the edge is created with the createEdge function",
    });

  tree.edges[edge.id] = edge;
};
