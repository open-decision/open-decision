import { Tree } from "../type-classes";
import { getNode } from "../getters";

export const removeInputFromNode =
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
    }
  };
