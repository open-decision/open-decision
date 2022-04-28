import { Tree } from "../type-classes";
import { getCondition, getNode } from "../getters";

export const relateConditionToNode =
  (tree: Tree.TTree) => (nodeId: string, conditionId: string) => {
    const node = getNode(tree)(nodeId);
    const condition = getCondition(tree)(conditionId);

    if (!node)
      return new Error(
        `The node with id ${nodeId} could not be found. Nothing has been changed.`
      );

    if (!condition)
      return new Error(
        `The condition with id ${conditionId} could not be found. Nothing has been changed.`
      );

    node.data.conditions.push(conditionId);
  };
