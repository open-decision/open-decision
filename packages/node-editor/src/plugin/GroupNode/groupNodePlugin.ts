import { DirectEdgePlugin } from "@open-decision/plugins-edge-direct";
import {
  TReadOnlyTreeClient,
  Tree,
  TTreeClient,
  INodePlugin,
  NodePluginWithVariable,
  TNodeId,
  TEdgeId,
  IVariablePlugin,
  createReadableKey,
} from "@open-decision/tree-type";
import { TRichText } from "@open-decision/rich-text-editor";
import { InterpreterContext } from "@open-decision/interpreter";

const DirectEdge = new DirectEdgePlugin();

export interface IGroupNodeVariable extends IVariablePlugin<"group"> {
  value: Record<string, IVariablePlugin<string> | undefined>[];
}

export const typeName = "group" as const;

export interface IGroupNode extends INodePlugin<typeof typeName> {
  content?: TRichText;
  cta?: string;
  tree?: Tree.TTree;
  title?: string;
}

export class GroupNodePlugin extends NodePluginWithVariable<
  IGroupNode,
  IGroupNodeVariable
> {
  constructor() {
    super(typeName);
    this.isAddable = false;
  }

  create =
    ({ position = { x: 0, y: 0 }, ...data }: Omit<IGroupNode, "id" | "type">) =>
    (_treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return {
        id: `nodes_${crypto.randomUUID()}`,
        type: this.type,
        position,
        ...data,
      } satisfies IGroupNode;
    };

  updateTitle =
    (nodeId: TNodeId, newTitle: string) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (!node) return;

      node.title = newTitle;
    };

  updateCta =
    (nodeId: TNodeId, newCta: string) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (!node) return;

      node.cta = newCta;
    };

  updateTarget =
    ({
      nodeId,
      newTarget,
      edgeId,
    }: {
      nodeId: TNodeId;
      newTarget: TNodeId;
      edgeId?: TEdgeId;
    }) =>
    (treeClient: TTreeClient) => {
      const edge = edgeId ? treeClient.edges.get.single(edgeId) : undefined;

      if (edge instanceof Error) throw edge;

      if (!edge?.target && newTarget) {
        const newEdge = DirectEdge.create({
          source: nodeId,
          target: newTarget,
        })(treeClient);

        if (newEdge instanceof Error) return;

        treeClient.edges.add(newEdge);
      }

      if (edge?.target && newTarget)
        treeClient.edges.connect.toTargetNode(edge.id, newTarget);
    };

  updateNodeContent =
    (nodeId: TNodeId, content: IGroupNode["content"]) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (!node) return;

      node.content = content;
    };

  getVariable = (nodeId: string, answers: any) => {
    return answers[nodeId] as IGroupNodeVariable | undefined;
  };

  createVariable =
    (nodeId: TNodeId, answer: InterpreterContext[]) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const node = treeClient.nodes.get.single<IGroupNode>(nodeId);

      if (!node) return;

      return {
        id: nodeId,
        type: this.type,
        name: node.name,
        escapedName: createReadableKey(node.name),
        value: answer.map((answer) => answer.variables),
      } satisfies IGroupNodeVariable;
    };
}
