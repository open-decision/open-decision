import { TTreeClient } from "@open-decision/tree-type";

export const deleteInput =
  (inputIds: string[]) => (treeClient: TTreeClient) => {
    inputIds.forEach((inputId) => {
      treeClient.pluginEntity.delete("inputs", inputId);
    });
  };
