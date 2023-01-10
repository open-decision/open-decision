import { DirectEdgePlugin } from "@open-decision/plugins-edge-direct";
import { RichText } from "@open-decision/rich-text-editor";
import { INodePlugin, NodePlugin, TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";
import { createFn, NodePlugin } from "@open-decision/plugins-node-helpers";

export const typeName = "info" as const;

export const DataType = z.object({
  content: RichText.optional(),
  target: z.string().optional(),
});

export type IInfoNodePlugin = INodePlugin<
  typeof typeName,
  z.infer<typeof DataType>
>;

export class InfoNodePlugin extends NodePlugin<IInfoNodePlugin> {
  constructor() {
    super(typeName);
  }

  create: createFn<typeof this.Type> =
    ({ data, ...rest }) =>
    (treeClient) => {
      const newNode = treeClient.nodes.create.node({
        type: this.typeName,
        data: { ...this.defaultData, ...data },
        ...rest,
      });

      return this.Type.parse(newNode);
    };

  updateNodeContent =
    (nodeId: string, content: IInfoNodePlugin["data"]["content"]) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

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
        const newEdge = DirectEdge.create({
          data: undefined,
          source: nodeId,
          target: newItem,
        })(treeClient);

        if (newEdge instanceof Error) return;

        treeClient.edges.add(newEdge);
      }

      if (edge?.target && newItem)
        treeClient.edges.connect.toTargetNode(edge.id, newItem);
    };
}
