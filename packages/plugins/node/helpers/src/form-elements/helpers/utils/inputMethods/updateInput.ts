import { TTreeClient } from "@open-decision/tree-type";
import { Input } from "..";

export const updateInput =
  <TType extends Input.TType>(Type: TType) =>
  <TNewInputType extends Input.TInput>(
    inputId: string,
    newInput: Omit<TNewInputType, "id">
  ) =>
  (treeClient: TTreeClient) => {
    const inputs = treeClient.pluginEntity.get.all<typeof Type>("inputs");

    if (!inputs) return;

    inputs[inputId] = { ...newInput, id: inputId };
  };
