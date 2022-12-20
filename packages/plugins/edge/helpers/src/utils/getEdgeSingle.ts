import { TReadOnlyTreeClient, TTreeClient } from "@open-decision/tree-type";

export const getEdgeSingle = <TReturn>(
  treeClient: TTreeClient | TReadOnlyTreeClient,
  conditionId: string
) => {
  return treeClient.edges.get.single(conditionId) as TReturn;
};
