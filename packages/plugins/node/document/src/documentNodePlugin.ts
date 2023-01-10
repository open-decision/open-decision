import { createFn, NodePlugin } from "@open-decision/plugins-node-helpers";
import { RichText } from "@open-decision/rich-text-editor";
import {
  deleteEntityFn,
  TReadOnlyTreeClient,
  TTreeClient,
} from "@open-decision/tree-type";
import { z } from "zod";

export const typeName = "document" as const;

export const DataType = z.object({
  content: RichText.optional(),
  templateUuid: z.string().uuid().optional(),
});

export type IDocumentNode = INodePlugin<
  typeof typeName,
  z.infer<typeof DataType>
>;

export class DocumentNodePlugin extends NodePlugin<IDocumentNode> {
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

  getByTemplateUuid =
    (templateUuid: string) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const nodes = this.getAll(treeClient);

      return Object.values(nodes ?? {}).filter(
        (node) => node.data?.templateUuid === templateUuid
      );
    };

  updateNodeContent =
    (nodeId: string, content: IDocumentNode["data"]["content"]) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      node.data.content = content;
    };

  updateTemplateUuid =
    (nodeId: string, newTemplateUuid: string) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      node.data.templateUuid = newTemplateUuid;
    };

  deleteTemplateUuid = (nodeId: string) => (treeClient: TTreeClient) => {
    const node = this.getSingle(nodeId)(treeClient);

    if (node instanceof Error) throw node;

    delete node.data.templateUuid;
  };
}
