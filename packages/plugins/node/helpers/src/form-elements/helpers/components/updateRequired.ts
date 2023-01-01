import { TTreeClient } from "@open-decision/tree-type";

export const updateRequired =
  (treeClient: TTreeClient) => (inputId: string, newValue: boolean) => {
    const input = treeClient.pluginEntity.get.single("inputs", inputId);

    input.data.required = newValue;
  };
