import { TReadOnlyTreeClient, TTreeClient } from "@open-decision/tree-type";

export const createDefaultName = (
  treeClient: TTreeClient | TReadOnlyTreeClient
) => {
  const inputsLength = Object.keys(
    treeClient.pluginEntity.get.all("inputs") ?? {}
  ).length;

  return `Eingabe ${inputsLength + 1}`;
};
