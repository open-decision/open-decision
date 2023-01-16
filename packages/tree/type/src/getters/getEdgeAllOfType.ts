import { pickBy } from "remeda";
import { IEdgePlugin } from "../plugin";
import { Tree } from "../type-classes";

export const getEdgeAllOfType =
  (tree: Tree.TTree) =>
  <TType extends IEdgePlugin>(type?: TType["type"]) => {
    return pickBy(tree.edges, (edge) => edge.type === type) as Record<
      string,
      TType
    >;
  };
