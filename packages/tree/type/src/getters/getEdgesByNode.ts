import { isEmpty } from "ramda";
import { Edge, Tree } from "../type-classes";
import { z } from "zod";

const isEdgeOfType = <
  TType extends Edge.TType<string>,
  TEdge extends z.infer<TType>
>(
  edge: TEdge,
  type: string
): edge is TEdge => edge.type === type;

export const getEdgesByNode =
  (tree: Tree.TTree) =>
  <TType extends z.ZodType>(nodeId: string, type?: string, Type?: TType) => {
    if (!tree.edges) return undefined;

    // We loop over the edges and check if the node is present on the edge.
    const relatedEdges: Record<
      "source" | "target",
      Record<string, z.infer<TType>> | undefined
    > = {
      source: undefined,
      target: undefined,
    };

    for (const key in tree.edges) {
      const edge = tree.edges[key];

      if (Type && type ? isEdgeOfType(edge, type) : true) {
        if (edge.source === nodeId) {
          if (!relatedEdges.source) relatedEdges.source = {};
          relatedEdges.source[key] = edge;
        }
        if (edge.target === nodeId) {
          if (!relatedEdges.target) relatedEdges.target = {};

          relatedEdges.target[key] = edge;
        }
      }
    }

    // If the resulting conditions are empty we return undefined, because it is more meaningful and
    // easier to handle downstream.
    if (isEmpty(relatedEdges.source) && isEmpty(relatedEdges.target))
      return undefined;

    return relatedEdges;
  };
