import { TTreeClient } from "@open-decision/tree-type";
import { Input } from "../..";

export const updateInput =
  <TNewInputType extends Input.TInput>(
    inputId: string,
    newInput: Omit<TNewInputType, "id">
  ) =>
  (treeClient: TTreeClient) => {
    const inputs =
      treeClient.pluginEntity.get.all<Input.TType<string>>("inputs");

    if (!inputs) return;

    inputs[inputId] = { ...newInput, id: inputId };
  };
