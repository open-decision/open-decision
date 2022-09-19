import { Tree } from "../type-classes";
import { getCondition, getInput } from "../getters";

export const connectInputAndCondition =
  (tree: Tree.TTree) => (conditionId: string, inputId: string) => {
    const condition = getCondition(tree)(conditionId);
    // We get the input just to validate that it exists.
    getInput(tree)(inputId);

    condition.inputId = inputId;
  };
