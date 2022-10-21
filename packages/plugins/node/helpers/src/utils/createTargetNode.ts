import { Node, TTreeClient } from "@open-decision/tree-type";

export const createTargetNode =
  (treeClient: TTreeClient) =>
  <TNodeType extends Node.TNode>(
    nodeId: string,
    conditionId: string,
    newNode: TNodeType
  ) => {
    const childNode = treeClient.nodes.create.childNode(nodeId, newNode);

    if (childNode instanceof Error) return childNode;

    const newEdge = treeClient.edges.create({
      source: nodeId,
      target: childNode.id,
      conditionId,
    });

    if (newEdge instanceof Error) return newEdge;

    treeClient.edges.add(newEdge);

    treeClient.nodes.add(childNode);

    return { id: childNode.id, label: childNode.name };
  };
