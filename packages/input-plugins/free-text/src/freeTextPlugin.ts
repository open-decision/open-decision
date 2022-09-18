import { InputPlugin, TTreeClient } from "@open-decision/type-classes";
import { Type } from "./types";
import { DirectPlugin } from "@open-decision/condition-plugins-direct";
import { z } from "zod";

export type TFreeTextInput = z.infer<FreeTextPlugin["MergedType"]>;

export class FreeTextPlugin extends InputPlugin<typeof Type, "freeText"> {
  declare directConditionPlugin: DirectPlugin;
  constructor(treeClient: TTreeClient) {
    super(treeClient, Type, "freeText");

    this.directConditionPlugin = new DirectPlugin(treeClient);
  }

  //FIXME Return type is not proper
  create(
    data: Omit<z.infer<typeof this.SpecificType>, "type">
  ): z.infer<typeof this.MergedType> {
    return this.treeClient.inputs.create({
      ...data,
      type: this.typeName,
    }) as z.infer<typeof this.MergedType>;
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
      this.treeClient.edges.update.target(edge.id, newItem);
  }
}
