import { DirectEdgePlugin } from "@open-decision/plugins-edge-direct";
import { RichText } from "@open-decision/rich-text-editor";
import {
  NodePlugin,
  TTreeClient,
  NodePluginBaseType,
  EntityPluginType,
} from "@open-decision/tree-type";
import { z } from "zod";

const DirectEdge = new DirectEdgePlugin();

export const typeName = "info" as const;

const DataType = z.object({
  content: RichText.optional(),
  target: z.string().optional(),
});

export const InfoNodePluginType = NodePluginBaseType(typeName, DataType);

export type IInfoNodePlugin = EntityPluginType<typeof InfoNodePluginType>;

export class InfoNodePlugin extends NodePlugin<IInfoNodePlugin> {
  constructor() {
    super(typeName, InfoNodePluginType, {});
  }

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
