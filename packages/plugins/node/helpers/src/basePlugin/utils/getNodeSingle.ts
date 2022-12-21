import { TReadOnlyTreeClient, TTreeClient } from "@open-decision/tree-type";

export const getNodeSingle = <TReturn>(
  treeClient: TTreeClient | TReadOnlyTreeClient,
  nodeId: string
) => {
  const node = treeClient.nodes.get.single(nodeId);

  if (node instanceof Error) return node;

  return node as TReturn;
};
