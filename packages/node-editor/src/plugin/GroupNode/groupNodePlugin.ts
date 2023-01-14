import { DirectEdgePlugin } from "@open-decision/plugins-edge-direct";
import { RichText } from "@open-decision/rich-text-editor";
import {
  NodePlugin,
  TReadOnlyTreeClient,
  Tree,
  TTreeClient,
  NodePluginBaseType,
  EntityPluginType,
} from "@open-decision/tree-type";
import { z } from "zod";

const DirectEdge = new DirectEdgePlugin();

export const typeName = "node-group" as const;

const DataType = z.object({
  children: z.array(z.string()),
  content: RichText.optional(),
  cta: z.string().optional(),
  tree: Tree.Type.optional(),
  title: z.string().optional(),
});

export const GroupNodePluginType = NodePluginBaseType(typeName, DataType);

export type TGroupNode = EntityPluginType<typeof GroupNodePluginType>;

export class GroupNodePlugin extends NodePlugin<TGroupNode> {
  constructor() {
    super(typeName, GroupNodePluginType, { children: [] });
    this.isAddable = false;
  }

  updateTitle =
    (nodeId: string, newTitle: string) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      node.data.title = newTitle;
    };

  updateCta =
    (nodeId: string, newCta: string) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      node.data.cta = newCta;
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

  updateNodeContent =
    (nodeId: string, content: TGroupNode["data"]["content"]) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      node.data.content = content;
    };
}
