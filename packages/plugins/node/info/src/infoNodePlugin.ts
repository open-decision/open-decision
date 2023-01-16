import { DirectEdgePlugin } from "@open-decision/plugins-edge-direct";
import { INodePlugin, NodePlugin } from "@open-decision/plugins-node-helpers";
import { TRichText } from "@open-decision/rich-text-editor";
import { TTreeClient, TReadOnlyTreeClient } from "@open-decision/tree-type";

const DirectEdge = new DirectEdgePlugin();

export const typeName = "info" as const;

export interface IInfoNodePlugin extends INodePlugin<typeof typeName> {
  content?: TRichText;
  target?: string;
}

export class InfoNodePlugin extends NodePlugin<IInfoNodePlugin> {
  constructor() {
    super(typeName);
  }

  create =
    ({
      position = { x: 0, y: 0 },
      ...data
    }: Omit<IInfoNodePlugin, "id" | "type">) =>
    (_treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return {
        id: crypto.randomUUID(),
        type: this.type,
        position,
        ...data,
      } satisfies IInfoNodePlugin;
    };

  updateNodeContent =
    (nodeId: string, content: IInfoNodePlugin["content"]) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      node.content = content;
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
