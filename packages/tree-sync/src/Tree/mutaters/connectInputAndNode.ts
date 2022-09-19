import { Tree } from "../type-classes";
import { getInput, getNode } from "../getters";

export const connectInputAndNode =
  (tree: Tree.TTree) => (nodeId: string, inputId: string) => {
    const node = getNode(tree)(nodeId);
    const input = getInput(tree)(inputId);

    if (!node)
      return new Error(
        `The node with id ${nodeId} could not be found. Nothing has been changed.`
      );

    if (!input)
      return new Error(
        `The input with id ${inputId} could not be found. Nothing has been changed.`
      );

    node.data.inputs.push(inputId);

    return true;
  };
