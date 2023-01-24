import { DirectEdgePlugin } from "@open-decision/plugins-edge-direct";
import { TreeClient } from "@open-decision/tree-type";
import { ODError } from "@open-decision/type-classes";
import { IGroupNode } from "../GroupNodePlugin";

const DirectEdge = new DirectEdgePlugin();

export const createSubTree = (masterNode: IGroupNode) => {
  if (!masterNode.tree)
    throw new ODError({
      code: "MISSING_TREE_IN_MODULE",
      message: "The module is missing a tree",
    });

  const treeClient = new TreeClient("", masterNode.tree);

  treeClient.nodes.add(masterNode);

  const edge = DirectEdge.create({
    source: masterNode.id,
    target: treeClient.get.startNodeId(),
  })(treeClient);

  if (edge instanceof ODError) {
    throw edge;
  }

  treeClient.edges.add(edge);

  return treeClient.get.tree();
};
