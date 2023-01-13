import { createFn, NodePlugin } from "@open-decision/plugins-node-helpers";
import { RichText } from "@open-decision/rich-text-editor";
import {
  TReadOnlyTreeClient,
  Tree,
  TTreeClient,
} from "@open-decision/tree-type";
import { z } from "zod";

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

export class GroupNodePlugin extends NodePlugin<
  typeof DataType,
  typeof typeName
> {
  constructor() {
    super(DataType, typeName, { isAddable: false });
    this.defaultData = { children: [] };
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
      const node = this.get.single(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      node.data.title = newTitle;
    };

  updateCta =
    (nodeId: string, newCta: string) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const node = this.get.single(nodeId)(treeClient);

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

  updateNodeContent =
    (nodeId: string, content: z.infer<typeof this.Type>["data"]["content"]) =>
    (treeClient: TTreeClient) => {
      const node = this.get.single(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      node.data.content = content;
    };
}

export type TGroupNode = z.infer<GroupNodePlugin["Type"]>;
