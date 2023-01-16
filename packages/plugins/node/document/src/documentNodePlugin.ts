import { TRichText } from "@open-decision/rich-text-editor";
import { NodePlugin, INodePlugin } from "@open-decision/plugins-node-helpers";
import { TReadOnlyTreeClient, TTreeClient } from "@open-decision/tree-type";

export const typeName = "document" as const;

export interface IDocumentNode extends INodePlugin<typeof typeName> {
  content?: TRichText;
  templateUuid?: string;
}

export class DocumentNodePlugin extends NodePlugin<IDocumentNode> {
  constructor() {
    super(typeName);
  }

  create =
    ({
      position = { x: 0, y: 0 },
      ...data
    }: Omit<IDocumentNode, "id" | "type">) =>
    (_treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return {
        id: crypto.randomUUID(),
        type: this.type,
        position,
        ...data,
      } satisfies IDocumentNode;
    };

  getByTemplateUuid =
    (templateUuid: string) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const nodes = this.getAll(treeClient);

      return Object.values(nodes ?? {}).filter(
        (node) => node.templateUuid === templateUuid
      );
    };

  updateNodeContent =
    (nodeId: string, content: IDocumentNode["content"]) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      node.content = content;
    };

  updateTemplateUuid =
    (nodeId: string, newTemplateUuid: string) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      node.templateUuid = newTemplateUuid;
    };

  deleteTemplateUuid = (nodeId: string) => (treeClient: TTreeClient) => {
    const node = this.getSingle(nodeId)(treeClient);

    if (node instanceof Error) throw node;

    delete node.templateUuid;
  };
}
