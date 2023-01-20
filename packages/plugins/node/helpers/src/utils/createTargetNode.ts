import { TNodeId } from "@open-decision/tree-ids";
import { INode, TTreeClient } from "@open-decision/tree-type";

export const createTargetNode =
  (treeClient: TTreeClient) =>
  <TNodeType extends INode>(nodeId: TNodeId, newNode: TNodeType) => {
    const childNode = treeClient.nodes.create.childNode(nodeId, newNode);

    if (!childNode) return undefined;

    treeClient.nodes.add(childNode);

    return { id: childNode.id, label: childNode.name };
  };
