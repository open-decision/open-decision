import { Tree, Input } from "../type-classes";

/**
 * Always adds a new Input to the tree. There are no rules so this
 * will never fail.
 *
 * @param input to be added to the tree
 */
export const addInput = (tree: Tree.TTree) => (input: Input.TInput) => {
  if (!tree.inputs) tree.inputs = {};

  tree.inputs[input.id] = input;
};
