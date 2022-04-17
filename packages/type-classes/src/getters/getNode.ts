import { pick } from "remeda";
import { Node, Tree } from "../type-classes";

export const getNode = (tree: Tree.TTree) => (nodeId: string) => {
  return tree.nodes?.[nodeId];
};

export const getNodes =
  (tree: Tree.TTree) =>
  (nodeIds: string[]): Node.TNodesRecord | undefined => {
    if (!tree.nodes) return undefined;

    const nodes = pick(tree.nodes, nodeIds);
    if (!nodes) return undefined;

    return nodes;
  };
