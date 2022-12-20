import { TTreeClient } from "@open-decision/tree-type";
import { Input } from "..";

export const updateLabel =
  (treeClient: TTreeClient) => (inputId: string, newLabel: string) => {
    const input = treeClient.pluginEntity.get.single<typeof Input.Type>(
      "inputs",
      inputId
    );

    if (!input) return;

    input.label = newLabel;
  };
