import { TTreeClient } from "@open-decision/tree-sync";
import { InputPlugin } from "@open-decision/input-plugins-helpers";
import { DirectPlugin } from "@open-decision/condition-plugins-direct";
import { z } from "zod";

export const Type = z.object({ type: z.literal("freeText") });

export type TFreeTextInput = z.infer<FreeTextPlugin["MergedType"]>;

export class FreeTextPlugin extends InputPlugin<typeof Type, "freeText"> {
  declare directConditionPlugin: DirectPlugin;
  constructor(treeClient: TTreeClient) {
    super(treeClient, Type, "freeText");

    this.directConditionPlugin = new DirectPlugin(treeClient);
  }

  createTargetNode(nodeId: string, inputId: string, data: { name: string }) {
    const childNode = this.treeClient.nodes.create.childNode(nodeId, {
      type: "customNode",
      data: { inputs: [], ...data },
    });

    if (childNode instanceof Error) return childNode;

    const newCondition = this.directConditionPlugin.create({
      inputId,
    });

    const newEdge = this.treeClient.edges.create({
      source: nodeId,
      target: childNode.id,
      conditionId: newCondition.id,
    });

    if (newEdge instanceof Error) return newEdge;

    this.treeClient.conditions.add(newCondition);
    this.treeClient.nodes.connect.toCondition(nodeId, newCondition.id);
    this.treeClient.edges.add(newEdge);

    this.treeClient.nodes.add(childNode);

    return { id: childNode.id, label: childNode.data.name };
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
      const newCondition = this.directConditionPlugin.create({
        inputId,
      });

      this.treeClient.conditions.add(newCondition);
      this.treeClient.nodes.connect.toCondition(nodeId, newCondition.id);

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
