import { TRichText } from "@open-decision/rich-text-editor";
import {
  INodePlugin,
  NodePlugin,
  TNodeId,
  TReadOnlyTreeClient,
  TTreeClient,
} from "@open-decision/tree-type";

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
    }: Partial<Omit<IDocumentNode, "id" | "type">>) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return treeClient.nodes.create.node<IDocumentNode>({
        type: this.type,
        position,
        ...data,
      });
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
    (nodeId: TNodeId, content: IDocumentNode["content"]) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (!node) return;

      node.content = content;
    };

  updateTemplateUuid =
    (nodeId: TNodeId, newTemplateUuid: string) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (!node) return;

      node.templateUuid = newTemplateUuid;
    };

  deleteTemplateUuid = (nodeId: TNodeId) => (treeClient: TTreeClient) => {
    const node = this.getSingle(nodeId)(treeClient);

    if (!node) return;

    delete node.templateUuid;
  };
}
