import { pickBy } from "remeda";
import { INodePlugin } from "../plugin";
import { Tree } from "../type-classes";

export const getNodeAllOfType =
  (tree: Tree.TTree) =>
  <TType extends INodePlugin>(type?: TType["type"]) => {
    return pickBy(tree.nodes, (node) => node.type === type) as Record<
      string,
      TType
    >;
  };
