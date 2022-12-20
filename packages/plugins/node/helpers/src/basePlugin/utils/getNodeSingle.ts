import { TReadOnlyTreeClient, TTreeClient } from "@open-decision/tree-type";

export const getNodeSingle = <TReturn>(
  treeClient: TTreeClient | TReadOnlyTreeClient,
  nodeId: string
) => {
  return treeClient.nodes.get.single(nodeId) as TReturn;
};
