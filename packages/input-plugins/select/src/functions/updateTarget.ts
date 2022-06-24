import { TTreeClient } from "@open-decision/type-classes";
import { selectPlugin } from "../selectPlugin";

export const updateTarget =
  (treeClient: TTreeClient) =>
  ({
    nodeId,
    inputId,
    answerId,
    newItem,
    edgeId,
  }: {
    nodeId: string;
    inputId: string;
    answerId: string;
    newItem: string;
    edgeId?: string;
  }) => {
    const edge = edgeId ? treeClient.edges.get(edgeId) : undefined;

    if (!edge?.target && newItem) {
      const newCondition = selectPlugin(treeClient).condition.compare.create({
        inputId,
        valueId: answerId,
      });

      treeClient.conditions.add(newCondition);
      treeClient.nodes.connect(nodeId, newCondition.id);

      const newEdge = treeClient.edges.create({
        source: nodeId,
        target: newItem,
        conditionId: newCondition.id,
      });

      if (newEdge instanceof Error) return;

      treeClient.edges.add(newEdge);
    }

    if (edge?.target && newItem)
      treeClient.edges.updateTarget(edge.id, newItem);
  };
