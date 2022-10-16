import { TTreeClient } from "@open-decision/tree-type";
import { Input } from "..";

export const updateInput =
  (treeClient: TTreeClient) =>
  <TInput extends Input.TInput>(
    inputId: string,
    newInput: Omit<TInput, "id">
  ) => {
    const inputs = treeClient.pluginEntity.get.all("inputs", Input.Type);
    if (!inputs) return;

    inputs[inputId] = { ...newInput, id: inputId };
  };
