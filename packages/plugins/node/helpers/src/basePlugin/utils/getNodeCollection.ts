import { TReadOnlyTreeClient, TTreeClient } from "@open-decision/tree-type";

export const getNodeCollection = <TReturn>(
  treeClient: TTreeClient | TReadOnlyTreeClient,
  nodeIds?: string[]
) => {
  return nodeIds
    ? (treeClient.nodes.get.collection(nodeIds) as TReturn)
    : (treeClient.nodes.get.all() as TReturn);
};
