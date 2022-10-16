import { TTreeClient } from "@open-decision/tree-type";
import { InputPlugin } from "@open-decision/input-plugins-helpers";
import { z } from "zod";
import { TextVariable } from "@open-decision/variable-plugins-text";

export const typeName = "text" as const;

export const DataType = z.object({
  label: z.string().optional(),
});

export type TTextInput = z.infer<TextInputPlugin["Type"]>;

export class TextInputPlugin extends InputPlugin<
  typeof DataType,
  typeof typeName,
  typeof TextVariable
> {
  constructor(treeClient: TTreeClient) {
    super(treeClient, DataType, typeName, TextVariable);
  }

  createTargetNode(nodeId: string, inputId: string, data: { name: string }) {
    const childNode = this.treeClient.nodes.create.childNode(nodeId, {
      data: { inputs: [], ...data },
    });

    if (childNode instanceof Error) return childNode;

    const newEdge = this.treeClient.edges.create({
      source: nodeId,
      target: childNode.id,
    });

    if (newEdge instanceof Error) return newEdge;

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
      const newEdge = this.treeClient.edges.create({
        source: nodeId,
        target: newItem,
      });

      if (newEdge instanceof Error) return;

      this.treeClient.edges.add(newEdge);
    }

    if (edge?.target && newItem)
      this.treeClient.edges.connect.toTargetNode(edge.id, newItem);
  }

  override getVariable(input: TTextInput) {
    return {
      id: input.id,
      type: this.typeName,
    };
  }
}
