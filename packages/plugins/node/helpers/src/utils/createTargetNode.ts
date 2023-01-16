import { INodePlugin, TNodeId, TTreeClient } from "@open-decision/tree-type";

export const createTargetNode =
  (treeClient: TTreeClient) =>
  <TNodeType extends INodePlugin>(nodeId: TNodeId, newNode: TNodeType) => {
    const childNode = treeClient.nodes.create.childNode(nodeId, newNode);

    if (!childNode) return undefined;

    treeClient.nodes.add(childNode);

    return { id: childNode.id, label: childNode.name };
  };
