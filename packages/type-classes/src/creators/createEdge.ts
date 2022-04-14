import { Edge, Tree } from "../type-classes";
import { v4 as uuid } from "uuid";
import { isValidEdge } from "../validators";

export type NewEdgeData = Partial<Edge.TEdge> &
  Required<Pick<Edge.TEdge, "source" | "target" | "conditionId">>;

export const createEdge =
  (tree: Tree.TTree) =>
  (edge: NewEdgeData): Error | Edge.TEdge => {
    if (edge.source === edge.target)
      return new Error(
        "Ein Knoten kann nicht mit sich selbst verbunden werden."
      );

    const newEdge: Edge.TEdge = {
      id: uuid(),
      type: "default",
      ...edge,
    };

    if (newEdge instanceof Error) return newEdge;
    const isEdgeValid = isValidEdge(tree)(newEdge);

    if (isEdgeValid instanceof Error) return isEdgeValid;

    return newEdge;
  };
