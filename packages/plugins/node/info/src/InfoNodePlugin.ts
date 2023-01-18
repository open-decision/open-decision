import { DirectEdgePlugin } from "@open-decision/plugins-edge-direct";
import { TRichText } from "@open-decision/rich-text-editor";
import {
  TTreeClient,
  TReadOnlyTreeClient,
  NodePlugin,
  INodePlugin,
  TNodeId,
  TEdgeId,
} from "@open-decision/tree-type";

const DirectEdge = new DirectEdgePlugin();

export const typeName = "info" as const;

export interface IInfoNodePlugin extends INodePlugin<typeof typeName> {
  content?: TRichText;
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
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return treeClient.nodes.create.node<IInfoNodePlugin>({
        type: this.type,
        position,
        ...data,
      });
    };

  updateNodeContent =
    (nodeId: TNodeId, content: IInfoNodePlugin["content"]) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (!node) return;

      node.content = content;
    };

  updateTarget =
    ({
      nodeId,
      newItem,
      edgeId,
    }: {
      nodeId: TNodeId;
      newItem: TNodeId;
      edgeId?: TEdgeId;
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
