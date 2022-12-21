import { RichText } from "@open-decision/rich-text-editor";
import { TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";
import { NodePlugin } from "@open-decision/plugins-node-helpers";

export const typeName = "info" as const;

export const DataType = z.object({
  content: RichText.optional(),
  target: z.string().optional(),
});

export class InfoNodePlugin extends NodePlugin<
  typeof DataType,
  typeof typeName
> {
  constructor() {
    super(DataType, typeName);

    this.defaultData = {};
  }

  updateNodeContent =
    (nodeId: string, content: z.infer<typeof this.Type>["data"]["content"]) =>
    (treeClient: TTreeClient) => {
      const node = this.get.single(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      node.data.content = content;
    };

  updateTarget =
    ({
      nodeId,
      newItem,
      edgeId,
    }: {
      nodeId: string;
      newItem: string;
      edgeId?: string;
    }) =>
    (treeClient: TTreeClient) => {
      const edge = edgeId ? treeClient.edges.get.single(edgeId) : undefined;

      if (edge instanceof Error) throw edge;

      if (!edge?.target && newItem) {
        const newEdge = treeClient.edges.create({
          source: nodeId,
          target: newItem,
        });

        if (newEdge instanceof Error) return;

        treeClient.edges.add(newEdge);
      }

      if (edge?.target && newItem)
        treeClient.edges.connect.toTargetNode(edge.id, newItem);
    };
}

export type TInfoNode = z.infer<InfoNodePlugin["Type"]>;
