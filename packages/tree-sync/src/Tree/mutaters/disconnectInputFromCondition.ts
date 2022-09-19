import { Tree } from "../type-classes";
import { getCondition } from "../getters";

export const disconnectInputAndCondition =
  (tree: Tree.TTree) => (conditionId: string) => {
    const condition = getCondition(tree)(conditionId);

    delete condition.inputId;
  };
