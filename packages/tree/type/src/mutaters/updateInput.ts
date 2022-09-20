import { getConditionsByInput } from "../getters";
import { Input, Tree } from "../type-classes";
import { deleteConditions } from "./deleteConditions";

export const updateInput =
  (tree: Tree.TTree) =>
  <TInput extends Input.TInput>(
    inputId: string,
    newInput: Omit<TInput, "id">
  ) => {
    const inputs = tree.inputs;
    if (!inputs) return;

    inputs[inputId] = { ...newInput, id: inputId };

    const condition = getConditionsByInput(tree)(inputId);

    if (condition)
      deleteConditions(tree)(
        Object.values(condition).map((condition) => condition.id)
      );
  };
