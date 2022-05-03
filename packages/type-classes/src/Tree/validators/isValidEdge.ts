import { isCircular } from "../utils";
import { Tree, Edge } from "../type-classes";

export const isValidEdge =
  (tree: Tree.TTree) =>
  ({ source, target }: Omit<Edge.TEdge, "id">): Error | true => {
    if (!target) return true;

    // Only validate edges with targets.
    // Make sure the edge does not already exist based on the combination of source and target.
    if (
      tree.edges &&
      Object.values(tree.edges).find(
        (existingEdge) =>
          existingEdge.source === source && existingEdge.target === target
      )
    ) {
      return new Error(
        "Eine Verbindung zwischen diesen Knoten existiert bereits."
      );
    }

    // Make sure the edge does not result in a circular connection.
    if (isCircular(tree)({ source, target }))
      return new Error(
        "Knoten können nicht mit vorherigen Knoten verbunden sein."
      );

    return true;
  };
