import { TTreeClient } from "@open-decision/tree-type";
import { Input } from "..";

export const updateInput =
  <TInput extends Input.TInput>(
    inputId: string,
    newInput: Omit<TInput, "id">
  ) =>
  (treeClient: TTreeClient) => {
    const inputs = treeClient.pluginEntity.get.all<typeof Input.Type>("inputs");

    if (!inputs) return;

    inputs[inputId] = { ...newInput, id: inputId };
  };
