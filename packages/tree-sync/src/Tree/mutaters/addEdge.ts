import { ODError } from "@open-decision/type-classes";
import { createEdge, NewEdgeData } from "../creators";
import { Tree, Edge } from "../type-classes";

/**
 * @summary Adds an edge to the tree under certain conditions.
 * @description
 * This functions adds a new edge if the following conditions are true:
 * - Does not connect to itself
 * - Edge does not already exist
 * - The Edge would not result in a circularly connected tree
 *
 * @param edge - Accepts a partial or full Edge. A partial Edge is used to create a new Edge,
 * while a full Edge is directly added to the Tree.
 */
export const addEdge = (tree: Tree.TTree) => (edge: Edge.TEdge) => {
  // If there is no edges array yet assign it.
  if (!tree.edges) tree.edges = {};

  tree.edges[edge.id] = edge;
};

export const createAndAddEdge = (tree: Tree.TTree) => (edge: NewEdgeData) => {
  const newEdge = createEdge(tree)(edge);

  if (newEdge instanceof ODError) return newEdge;

  return addEdge(tree)(newEdge);
};
