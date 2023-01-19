import { fromPairs, isEmpty } from "ramda";
import { IEdge, TEdgeId } from "../plugin";
import { Tree } from "../type-classes";
import { getEdgeSingle } from "./getEdgeSingle";

export const getEdgeMany =
  (tree: Tree.TTree) =>
  <TType extends IEdge>(ids: TEdgeId[], type?: TType["type"]) => {
    const edges = fromPairs(
      ids.map((id) => [id, getEdgeSingle(tree)(id, type)])
    );

    if (!isEmpty(edges)) return undefined;

    return edges as Record<string, TType>;
  };
