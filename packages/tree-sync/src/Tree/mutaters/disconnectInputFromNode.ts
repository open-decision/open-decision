import { Tree } from "../type-classes";
import { getNode } from "../getters";

export const disconnectInputAndNode =
  (tree: Tree.TTree) => (nodeId: string, inputId: string) => {
    const node = getNode(tree)(nodeId);

    const inputIndex = node.data.inputs.findIndex(
      (nodeInputId) => nodeInputId === inputId
    );

    if (inputIndex >= 0) {
      node.data.inputs.splice(inputIndex, 1);
    }
  };
