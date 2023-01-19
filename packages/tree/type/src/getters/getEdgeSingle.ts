import { ODProgrammerError } from "@open-decision/type-classes";
import { IEdge, TEdgeId } from "../plugin";
import { Tree } from "../type-classes";

export const getEdgeSingle =
  (tree: Tree.TTree) =>
  <TType extends IEdge>(id: TEdgeId, type?: TType["type"]) => {
    const edge = tree.edges[id];

    if (!edge) return undefined;

    if (type && edge.type !== type) {
      console.warn(
        new ODProgrammerError({
          code: "INVALID_ENTITY_TYPE",
          message: `You are trying to get a edge with a type of ${type}, but the edge of id ${id} is of type ${edge.type}`,
        })
      );

      return undefined;
    }

    return edge as TType;
  };
