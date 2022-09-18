import { pick } from "remeda";
import { Tree } from "../type-classes";

export const getInputsByNode = (tree: Tree.TTree) => (nodeId: string) => {
  const node = tree.nodes?.[nodeId];

  if (node && tree.inputs) {
    return pick(tree.inputs, node.data.inputs);
  }

  return undefined;
};
