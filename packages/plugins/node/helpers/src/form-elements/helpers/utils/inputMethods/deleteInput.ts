import { TTreeClient } from "@open-decision/tree-type";
import { TInputId } from "../../InputPlugin";

export const deleteInput =
  (inputIds: TInputId[]) => (treeClient: TTreeClient) => {
    inputIds.forEach((inputId) => {
      treeClient.pluginEntity.delete("inputs", inputId);
    });
  };
