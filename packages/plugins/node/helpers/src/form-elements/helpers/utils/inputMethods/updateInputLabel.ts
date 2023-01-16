import { TTreeClient } from "@open-decision/tree-type";
import { ODProgrammerError } from "@open-decision/type-classes";
import { IInputPlugin } from "../../InputPlugin";

export const updateInputLabel =
  <TType extends IInputPlugin>() =>
  (inputId: string, newLabel: string) =>
  (treeClient: TTreeClient) => {
    const input = treeClient.pluginEntity.get.single<TType>("inputs", inputId);

    if (input instanceof ODProgrammerError) return;

    input.label = newLabel;
  };
