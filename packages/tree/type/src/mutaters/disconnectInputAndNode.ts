import { Tree } from "../type-classes";
import { getNode } from "../getters";

export const disconnectInputAndNode =
  (tree: Tree.TTree) => (nodeId: string, inputId: string) => {
    const node = getNode(tree)(nodeId);

    const inputIndex = node.inputs.findIndex(
      (nodeInputId) => nodeInputId === inputId
    );

    if (inputIndex >= 0) {
      node.inputs.splice(inputIndex, 1);
    }
  };
