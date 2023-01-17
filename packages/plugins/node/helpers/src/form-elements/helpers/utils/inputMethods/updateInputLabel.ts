import { TTreeClient } from "@open-decision/tree-type";
import { IInputPlugin, TInputId } from "../../InputPlugin";

export const updateInputLabel =
  <TType extends IInputPlugin>() =>
  (inputId: TInputId, newLabel: string) =>
  (treeClient: TTreeClient) => {
    const input = treeClient.pluginEntity.get.single<TType>("inputs", inputId);

    if (!input) return;

    input.label = newLabel;
  };
