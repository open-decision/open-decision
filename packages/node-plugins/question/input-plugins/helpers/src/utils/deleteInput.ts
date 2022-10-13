import { TTreeClient } from "@open-decision/tree-type";

export const deleteInput = (treeClient: TTreeClient) => (ids: string[]) => {
  ids.forEach((id) => {
    treeClient.pluginEntity.delete(id);
  });
};
