import { TRichText } from "@open-decision/rich-text-editor";
import { TNodeId } from "@open-decision/tree-id";
import {
  createFn,
  INode,
  NodePlugin,
  TReadOnlyTreeClient,
  TTreeClient,
} from "@open-decision/tree-type";

export const typeName = "document" as const;

export interface IDocumentNode extends INode<typeof typeName> {
  content?: TRichText;
  templateUuid?: string;
}

export class DocumentNodePlugin extends NodePlugin<IDocumentNode> {
  constructor() {
    super(typeName);
  }

  create: createFn<IDocumentNode> = (data) => (treeClient) => {
    return treeClient.nodes.create.node<IDocumentNode>({
      type: this.type,
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
