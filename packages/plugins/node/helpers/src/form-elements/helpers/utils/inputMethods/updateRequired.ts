import { TTreeClient } from "@open-decision/tree-type";
import { TInputId } from "../../InputPlugin";
import { InputWithRequired } from "./sharedTypes";

export const updateRequired =
  <TType extends InputWithRequired>() =>
  (inputId: TInputId, newValue: boolean) =>
  (treeClient: TTreeClient) => {
    const input = treeClient.pluginEntity.get.single<TType>("inputs", inputId);

    if (!input) return;

    input.required = newValue;
  };
