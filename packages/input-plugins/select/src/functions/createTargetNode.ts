import { TTreeClient } from "@open-decision/type-classes";
import { comparePlugin } from "@open-decision/compare-condition-plugin";

export const createTargetNode =
  (treeClient: TTreeClient) =>
  (nodeId: string, inputId: string, valueId: string) => {
    const childNode = treeClient.nodes.createChild(nodeId, {
      data: { inputs: [inputId] },
    });

    if (childNode instanceof Error) return childNode;

    const newCondition = comparePlugin(treeClient).create({
      inputId,
      valueId,
    });

    const newEdge = treeClient.edges.create({
      source: nodeId,
      target: childNode.id,
      conditionId: newCondition.id,
    });

    if (newEdge instanceof Error) return newEdge;

    treeClient.conditions.add(newCondition);
    treeClient.nodes.connect.toCondition(nodeId, newCondition.id);
    treeClient.edges.add(newEdge);

    treeClient.nodes.add(childNode);

    return { id: childNode.id, label: childNode.data.name };
  };
