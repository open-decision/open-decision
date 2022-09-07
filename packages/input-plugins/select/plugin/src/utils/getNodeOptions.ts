import { Edge } from "@open-decision/type-classes";
import { TTreeClient } from "../selectPlugin";

export const getNodeOptions =
  (treeClient: TTreeClient) => (nodeId: string, edge?: Edge.TEdge) => {
    const node = treeClient.nodes.get.single(nodeId);

    const nodeOptions = node
      ? edge?.target
        ? ([
            ...treeClient.nodes.get.connectableNodes(nodeId),
            edge.target,
          ] as string[])
        : treeClient.nodes.get.connectableNodes(nodeId)
      : ([] as string[]);

    return treeClient.nodes.get.collection(nodeOptions);
  };
