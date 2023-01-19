import { pickBy } from "remeda";
import { IEdge } from "../plugin";
import { Tree } from "../type-classes";

export const getEdgeAllOfType =
  (tree: Tree.TTree) =>
  <TType extends IEdge>(type?: TType["type"]) => {
    return pickBy(tree.edges, (edge) => edge.type === type) as Record<
      string,
      TType
    >;
  };
