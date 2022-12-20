import { DirectEdgePlugin } from "@open-decision/plugins-edge-direct";
import { TreeClient } from "@open-decision/tree-type";
import { ODError } from "@open-decision/type-classes";
import { TGroupNode } from "../groupNodePlugin";

const DirectEdge = new DirectEdgePlugin();

export const createSubTree = (masterNode: TGroupNode) => {
  const treeClient = new TreeClient(masterNode.data.tree);

  treeClient.nodes.add(masterNode);

  const edge = DirectEdge.create({
    source: masterNode.id,
    target: treeClient.get.startNodeId(),
  })(treeClient);

  if (edge instanceof ODError) {
    throw edge;
  }

  treeClient.edges.add(edge);
  treeClient.updateStartNode(masterNode.id);

  return treeClient.get.tree();
};
