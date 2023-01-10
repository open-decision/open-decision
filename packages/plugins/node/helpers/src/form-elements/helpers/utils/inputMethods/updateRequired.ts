import { TTreeClient } from "@open-decision/tree-type";
import { InputWithRequired } from "./sharedTypes";

export const updateRequired =
  <TType extends InputWithRequired>() =>
  (inputId: string, newValue: boolean) =>
  (treeClient: TTreeClient) => {
    const input = treeClient.pluginEntity.get.single<TType>("inputs", inputId);

    input.data.required = newValue;
  };
