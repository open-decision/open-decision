import { Tree } from "../type-classes";
import { getCondition, getNode } from "../getters";

export const connectConditionAndNode =
  (tree: Tree.TTree) => (nodeId: string, conditionId: string) => {
    const node = getNode(tree)(nodeId);
    // We get the condition just to validate that it exists.
    getCondition(tree)(conditionId);

    node.data.conditions.push(conditionId);
  };
