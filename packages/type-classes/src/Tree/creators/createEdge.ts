import { Edge, Tree } from "../type-classes";
import { v4 as uuid } from "uuid";
import { isValidEdge } from "../validators";
import { ODError } from "../../Error";

export type NewEdgeData = Partial<Edge.TEdge> &
  Required<Pick<Edge.TEdge, "source" | "target">>;

export const createEdge =
  (tree: Tree.TTree) =>
  (edge: NewEdgeData): ODError | Edge.TEdge => {
    if (edge.source === edge.target)
      return new ODError({
        code: "CONNECTED_TO_SELF",
        message: "Ein Knoten kann nicht mit sich selbst verbunden werden.",
      });

    const newEdge: Edge.TEdge = {
      id: uuid(),
      type: "default",
      ...edge,
    };

    const isEdgeValid = isValidEdge(tree)(newEdge);

    if (isEdgeValid instanceof ODError) return isEdgeValid;

    return newEdge;
  };
