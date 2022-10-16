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
