import { TTreeClient } from "@open-decision/tree-type";
import { IInputPlugin } from "../../InputPlugin";

export const updateInput =
  <TNewInputType extends IInputPlugin>(
    inputId: string,
    newInput: Omit<TNewInputType, "id">
  ) =>
  (treeClient: TTreeClient) => {
    const inputs = treeClient.pluginEntity.get.all("inputs");

    if (!inputs) return;

    inputs[inputId] = { ...newInput, id: inputId };
  };
