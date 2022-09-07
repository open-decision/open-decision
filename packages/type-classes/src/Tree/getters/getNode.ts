import { isEmpty } from "ramda";
import { pick } from "remeda";
import { Tree } from "../type-classes";

export const getNode = (tree: Tree.TTree) => (nodeId: string) => {
  return tree.nodes?.[nodeId];
};

export const getNodes = (tree: Tree.TTree) => (nodeIds: string[]) => {
  if (!tree.nodes) return undefined;

  const nodes = pick(tree.nodes, nodeIds);
  if (!nodes || isEmpty(nodes)) return undefined;

  return nodes;
};
