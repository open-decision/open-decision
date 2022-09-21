import { Tree } from "../type-classes";
import { getInput, getNode } from "../getters";

export const connectInputAndNode =
  (tree: Tree.TTree) => (nodeId: string, inputId: string) => {
    const node = getNode(tree)(nodeId);
    // We get the input just to validate that it exists.
    getInput(tree)(inputId);

    node.inputs.push(inputId);
  };
