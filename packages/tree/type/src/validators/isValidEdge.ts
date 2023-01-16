import { isCircular } from "../utils";
import { Tree } from "../type-classes";
import { ODError } from "@open-decision/type-classes";
import { IEdgePlugin } from "../plugin";

/**
 * Validates an edge object based on the full tree.
 * An Edge cannot be:
 * 1. A duplicate
 * 2. A circular connection
 * @param tree the full tree
 */
export const isValidEdge =
  (tree: Tree.TTree) =>
  ({ source, target }: Omit<IEdgePlugin, "id">) => {
    // Only validate edges with targets.
    if (!target) return true;

    // Make sure the edge does not already exist based on the combination of source and target.
    if (
      tree.edges &&
      Object.values(tree.edges).find(
        (existingEdge) =>
          existingEdge.target &&
          existingEdge.source === source &&
          existingEdge.target === target
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
