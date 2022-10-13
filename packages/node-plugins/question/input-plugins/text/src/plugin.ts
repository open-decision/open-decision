import { TTreeClient } from "@open-decision/tree-type";
import { InputPlugin } from "@open-decision/input-plugins-helpers";
import { DirectConditionPlugin } from "@open-decision/condition-plugins-direct";
import { z } from "zod";

export const typeName = "text" as const;

export const DataType = z.object({
  label: z.string().optional(),
});

export type TTextInput = z.infer<TextInputPlugin["Type"]>;

export class TextInputPlugin extends InputPlugin<
  typeof DataType,
  typeof typeName
> {
  declare directConditionPlugin: DirectConditionPlugin;
  constructor(treeClient: TTreeClient) {
    super(treeClient, DataType, typeName);

    this.directConditionPlugin = new DirectConditionPlugin(treeClient);
  }

  createTargetNode(nodeId: string, inputId: string, data: { name: string }) {
    const childNode = this.treeClient.nodes.create.childNode(nodeId, {
      data: { inputs: [], ...data },
    });

    if (childNode instanceof Error) return childNode;

    const newCondition = this.directConditionPlugin.create(inputId);

    const newEdge = this.treeClient.edges.create({
      source: nodeId,
      target: childNode.id,
      conditionId: newCondition.id,
    });

    if (newEdge instanceof Error) return newEdge;

    this.treeClient.conditions.add(newCondition);
    this.treeClient.conditions.connect.toInput(newCondition.id, inputId);
    this.treeClient.edges.add(newEdge);

    this.treeClient.nodes.add(childNode);

    return { id: childNode.id, label: childNode.name };
  }

  updateTarget({
    nodeId,
    inputId,
    newItem,
    edgeId,
  }: {
    nodeId: string;
    inputId: string;
    newItem: string;
    edgeId?: string;
  }) {
    const edge = edgeId ? this.treeClient.edges.get.single(edgeId) : undefined;

    if (!edge?.target && newItem) {
      const newCondition = this.directConditionPlugin.create(inputId);

      this.treeClient.conditions.add(newCondition);
      this.treeClient.conditions.connect.toInput(newCondition.id, inputId);

      const newEdge = this.treeClient.edges.create({
        source: nodeId,
        target: newItem,
        conditionId: newCondition.id,
      });

      if (newEdge instanceof Error) return;

      this.treeClient.edges.add(newEdge);
    }

    if (edge?.target && newItem)
      this.treeClient.edges.connect.toTargetNode(edge.id, newItem);
  }
}
