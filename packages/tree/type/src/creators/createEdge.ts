import { Tree } from "../type-classes";
import { v4 as uuid } from "uuid";
import { isValidEdge } from "../validators";
import { ODError } from "@open-decision/type-classes";
import { IEdgePlugin } from "../plugin";

/**
 * Used to create a valid new edge. This needs the full tree to make sure the edge is valid.
 */
export const createEdge =
  (tree: Tree.TTree) =>
  <TEdgeType extends IEdgePlugin>(edge: Omit<TEdgeType, "id">) => {
    // Make sure the edge does not connect the node to itself.
    if (edge.source === edge.target)
      return new ODError({
        code: "CONNECTED_TO_SELF",
        message: "A node cannot connect to itself",
      });

    // Create the edge object
    const newEdge = {
      id: `edges_${uuid()}`,
      ...edge,
    } satisfies IEdgePlugin;

    // Validate the created edge object, based on the rest of the tree.
    const isEdgeValid = isValidEdge(tree)(newEdge);

    if (isEdgeValid instanceof ODError) return isEdgeValid;

    return newEdge;
  };
