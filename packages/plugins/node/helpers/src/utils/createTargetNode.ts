import { Node, TTreeClient } from "@open-decision/tree-type";

export const createTargetNode =
  (treeClient: TTreeClient) =>
  <TNodeType extends Node.TNode>(nodeId: string, newNode: TNodeType) => {
    const childNode = treeClient.nodes.create.childNode(nodeId, newNode);

    if (childNode instanceof Error) return childNode;

    treeClient.nodes.add(childNode);

    return { id: childNode.id, label: childNode.name };
  };
