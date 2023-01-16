import { TTreeClient } from "@open-decision/tree-type";
import { IInputPlugin, TInputId } from "../../InputPlugin";

export const updateInput =
  <TNewInputType extends IInputPlugin>(
    inputId: TInputId,
    newInput: Omit<TNewInputType, "id">
  ) =>
  (treeClient: TTreeClient) => {
    const inputs = treeClient.pluginEntity.get.all("inputs");

    if (!inputs) return;

    inputs[inputId] = { ...newInput, id: inputId };
  };
