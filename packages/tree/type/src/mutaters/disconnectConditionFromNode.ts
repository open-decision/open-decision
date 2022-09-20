import { Tree } from "../type-classes";
import { getNode } from "../getters";

export const disconnectConditionAndNode =
  (tree: Tree.TTree) => (nodeId: string, conditionId: string) => {
    const node = getNode(tree)(nodeId);

    const inputIndex = node.data.conditions.findIndex(
      (nodeConditionId) => nodeConditionId === conditionId
    );

    if (inputIndex >= 0) {
      node.data.conditions.splice(inputIndex, 1);
    }
  };
