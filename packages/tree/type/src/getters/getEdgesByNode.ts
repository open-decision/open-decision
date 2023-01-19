import { isEmpty } from "ramda";
import { Tree } from "../type-classes";
import { IEdge, TEdgeId } from "../plugin/EdgePlugin";
import { getEdgeSingle } from "./getEdgeSingle";
import { TNodeId } from "../plugin";
import { forEachObj } from "remeda";

const isEdgeOfType = <TType extends IEdge>(
  edge: TType,
  type: string
): edge is TType => edge.type === type;

export const getEdgesByNode =
  (tree: Tree.TTree) =>
  <TType extends IEdge>(nodeId: TNodeId, type?: string) => {
    if (!tree.edges) return undefined;

    // We loop over the edges and check if the node is present on the edge.
    const relatedEdges: Record<
      "source" | "target",
      Record<TEdgeId, TType> | undefined
    > = {
      source: undefined,
      target: undefined,
    };

    forEachObj.indexed(tree.edges, (_, key) => {
      const edge = getEdgeSingle(tree)<TType>(key);

      if (!edge) return;

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
    });

    // If the resulting conditions are empty we return undefined, because it is more meaningful and
    // easier to handle downstream.
    if (isEmpty(relatedEdges.source) && isEmpty(relatedEdges.target))
      return undefined;

    return relatedEdges;
  };
