import { isCircular } from "../utils";
import { Tree, Edge } from "../type-classes";
import { ODError } from "../../Error";

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
      return new ODError({
        code: "DUPLICATE_EDGE",
        message: "Eine Verbindung zwischen diesen Knoten existiert bereits.",
      });
    }

    // Make sure the edge does not result in a circular connection.
    if (isCircular(tree)({ source, target }))
      return new ODError({
        code: "CIRCULAR_CONNECTION",
        message:
          "Eine Verbindung zwischen diesen Knoten würde zu einer zirkulären Verbindung führen.",
      });

    return true;
  };
