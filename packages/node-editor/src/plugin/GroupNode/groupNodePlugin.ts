import { DirectEdgePlugin } from "@open-decision/plugins-edge-direct";
import { createFn, NodePlugin } from "@open-decision/plugins-node-helpers";
import { RichText } from "@open-decision/rich-text-editor";
import {
  TNodePlugin,
  NodePlugin,
  TReadOnlyTreeClient,
  Tree,
  TTreeClient,
} from "@open-decision/tree-type";
import { z } from "zod";

const DirectEdge = new DirectEdgePlugin();

export const typeName = "node-group" as const;

export const DataType = z
  .object({
    children: z.array(z.string()),
    content: RichText.optional(),
    cta: z.string().optional(),
    tree: Tree.Type.optional(),
    title: z.string().optional(),
  })
  .default({
    children: [],
  });

export type IGroupNode = TNodePlugin<typeof typeName, z.infer<typeof DataType>>;

export class GroupNodePlugin extends NodePlugin<IGroupNode> {
  constructor() {
    super(typeName, { children: [] });
    this.isAddable = false;
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
    (nodeId: string, content: IGroupNode["data"]["content"]) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      node.data.content = content;
    };
}
