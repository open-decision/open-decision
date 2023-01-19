import { DirectEdgePlugin } from "@open-decision/plugins-edge-direct";
import { TRichText } from "@open-decision/rich-text-editor";
import {
  TTreeClient,
  NodePlugin,
  INode,
  TNodeId,
  TEdgeId,
  createFn,
} from "@open-decision/tree-type";

const DirectEdge = new DirectEdgePlugin();

export const typeName = "info" as const;

export interface IInfoNode extends INode<typeof typeName> {
  content?: TRichText;
}

export class InfoNodePlugin extends NodePlugin<IInfoNode> {
  constructor() {
    super(typeName);
  }

  create: createFn<IInfoNode> = (data) => (treeClient) => {
    return treeClient.nodes.create.node<IInfoNode>({
      type: this.type,
      ...data,
    });
  };

  updateNodeContent =
    (nodeId: TNodeId, content: IInfoNode["content"]) =>
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
