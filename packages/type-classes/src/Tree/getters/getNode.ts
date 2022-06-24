import { pick } from "remeda";
import { Tree } from "../type-classes";

export const getNode = (tree: Tree.TTree) => (nodeId: string) => {
  const node = tree.nodes?.[nodeId];

  return node;
};

export const getNodes = (tree: Tree.TTree) => (nodeIds: string[]) => {
  if (!tree.nodes) return undefined;

  const nodes = pick(tree.nodes, nodeIds);
  if (!nodes) return undefined;

  return nodes;
};
