import { fromPairs, isEmpty } from "ramda";
import { IEdgePlugin, TEdgeId } from "../plugin";
import { Tree } from "../type-classes";
import { getEdgeSingle } from "./getEdgeSingle";

export const getEdgeMany =
  (tree: Tree.TTree) =>
  <TType extends IEdgePlugin>(ids: TEdgeId[], type?: TType["type"]) => {
    const edges = fromPairs(
      ids.map((id) => [id, getEdgeSingle(tree)(id, type)])
    );

    if (!isEmpty(edges)) return undefined;

    return edges as Record<string, TType>;
  };
