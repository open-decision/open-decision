import { TTreeClient } from "@open-decision/tree-type";
import { Input } from "..";

export const updateRequired =
  (treeClient: TTreeClient) => (inputId: string, newValue: boolean) => {
    const input = treeClient.pluginEntity.get.single<typeof Input.Type>(
      "inputs",
      inputId
    );

    input.required = newValue;
  };
