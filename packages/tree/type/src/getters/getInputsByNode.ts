import { pick } from "remeda";
import { Tree } from "../type-classes";
import { isEmpty } from "ramda";

/**
 * Provide a node id and receive the inputs that are related to it.
 * Returns undefined if there are no inputs.
 */
export const getInputsByNode = (tree: Tree.TTree) => (nodeId: string) => {
  const node = tree.nodes?.[nodeId];

  if (node && tree.inputs) {
    const inputs = pick(tree.inputs, node.inputs);

    // Instead of returning an empty object, return undefined. This is more meaningful and
    // easier to handle downstream.
    if (isEmpty(inputs)) return undefined;
    return inputs;
  }

  return undefined;
};
