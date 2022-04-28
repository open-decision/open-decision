import { Tree } from "../type-classes";
import { getCondition, getInput } from "../getters";

export const relateInputToCondition =
  (tree: Tree.TTree) => (conditionId: string, inputId: string) => {
    const condition = getCondition(tree)(conditionId);
    const input = getInput(tree)(inputId);

    if (!condition)
      return new Error(
        `The condition with id ${conditionId} could not be found. Nothing has been changed.`
      );

    if (!input)
      return new Error(
        `The input with id ${inputId} could not be found. Nothing has been changed.`
      );

    condition.inputId = inputId;
  };
