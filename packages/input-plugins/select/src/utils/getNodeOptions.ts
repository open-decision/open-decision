import { TTreeClient, Edge } from "@open-decision/type-classes";

export const getNodeOptions =
  (treeClient: TTreeClient) => (nodeId: string, edge?: Edge.TEdge) => {
    const node = treeClient.nodes.get.byId(nodeId);

    const nodeOptions = node
      ? edge?.target
        ? ([
            ...treeClient.nodes.get.connectableNodes(nodeId),
            edge.target,
          ] as string[])
        : treeClient.nodes.get.connectableNodes(nodeId)
      : ([] as string[]);

    return treeClient.nodes.getN.onlyWithNames(nodeOptions);
  };
