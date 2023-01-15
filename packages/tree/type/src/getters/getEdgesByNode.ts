import { isEmpty } from "ramda";
import { Tree } from "../type-classes";

import { TEdgePlugin } from "../plugin/EdgePlugin";
import { getSingle } from "./getSingle";

const isEdgeOfType = <TType extends TEdgePlugin>(
  edge: TType,
  type: string
): edge is TType => edge.type === type;

export const getEdgesByNode =
  (tree: Tree.TTree) =>
  <TType extends TEdgePlugin>(nodeId: string, type?: string) => {
    if (!tree.edges) return undefined;

    // We loop over the edges and check if the node is present on the edge.
    const relatedEdges: Record<
      "source" | "target",
      Record<string, TType> | undefined
    > = {
      source: undefined,
      target: undefined,
    };

    for (const key in tree.edges) {
      const edge = getSingle(tree)<TType>("edges")(key);

      if (edge instanceof Error) continue;

      if (type ? isEdgeOfType(edge, type) : true) {
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
