import { TTreeClient } from "@open-decision/tree-type";
import { Input, getConditionByInput } from "..";

export const updateInput =
  (treeClient: TTreeClient) =>
  <TInput extends Input.TInput>(
    inputId: string,
    newInput: Omit<TInput, "id">
  ) => {
    const inputs = treeClient.pluginEntity.get.all("inputs", Input.Type);
    if (!inputs) return;

    inputs[inputId] = { ...newInput, id: inputId };

    const condition = getConditionByInput(treeClient)(inputId);

    if (condition)
      treeClient.conditions.delete(
        Object.values(condition).map((condition) => condition.id)
      );
  };
