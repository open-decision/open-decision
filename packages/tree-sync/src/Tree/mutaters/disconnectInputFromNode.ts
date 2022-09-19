import { Tree } from "../type-classes";
import { getNode } from "../getters";

export const disconnectInputFromNode =
  (tree: Tree.TTree) => (nodeId: string, inputId: string) => {
    const node = getNode(tree)(nodeId);

    if (!node)
      return new Error(
        `The node with id ${nodeId} could not be found. Nothing has been changed.`
      );

    const inputIndex = node.data.inputs.findIndex(
      (nodeInputId) => nodeInputId === inputId
    );

    if (inputIndex >= 0) {
      node.data.inputs.splice(inputIndex, 1);
      return true;
    }

    return new Error(
      `The input with id ${inputId} could not be found on the node`
    );
  };
