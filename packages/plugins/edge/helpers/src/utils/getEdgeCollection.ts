import { TReadOnlyTreeClient, TTreeClient } from "@open-decision/tree-type";

export const getEdgeCollection = <TReturn>(
  treeClient: TTreeClient | TReadOnlyTreeClient,
  conditionIds?: string[]
) => {
  return conditionIds
    ? (treeClient.edges.get.collection(conditionIds) as TReturn)
    : (treeClient.edges.get.all() as TReturn);
};
