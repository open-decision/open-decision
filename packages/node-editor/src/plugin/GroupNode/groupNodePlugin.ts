import { DirectEdgePlugin } from "@open-decision/plugins-edge-direct";
import {
  NodePlugin,
  TReadOnlyTreeClient,
  Tree,
  TTreeClient,
  INodePlugin,
  NodePluginWithVariable,
  IVariablePlugin,
} from "@open-decision/tree-type";
import { TRichText } from "@open-decision/rich-text-editor";
import { InterpreterContext } from "@open-decision/interpreter";

const DirectEdge = new DirectEdgePlugin();

export interface IGroupNodeVariable extends IVariablePlugin<"group"> {
  value: Record<string, IVariablePlugin<string>>[];
}

export const typeName = "group" as const;

export interface IGroupNode extends INodePlugin<typeof typeName> {
  content?: TRichText;
  cta?: string;
  tree?: Tree.TTree;
  title?: string;
}

export class GroupNodePlugin
  extends NodePlugin<IGroupNode>
  implements NodePluginWithVariable<IGroupNodeVariable>
{
  constructor() {
    super(typeName);
    this.isAddable = false;
  }

  create =
    ({ position = { x: 0, y: 0 }, ...data }: Omit<IGroupNode, "id" | "type">) =>
    (_treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return {
        id: crypto.randomUUID(),
        type: this.type,
        position,
        ...data,
      } satisfies IGroupNode;
    };

  updateTitle =
    (nodeId: string, newTitle: string) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      node.title = newTitle;
    };

  updateCta =
    (nodeId: string, newCta: string) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      node.cta = newCta;
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

  updateNodeContent =
    (nodeId: string, content: IGroupNode["content"]) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      node.content = content;
    };

  getVariable = (nodeId: string, answers: any) => {
    return answers[nodeId] as IGroupNodeVariable | undefined;
  };

  createVariable =
    (nodeId: string, answer: InterpreterContext[]) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const node = treeClient.nodes.get.single<IGroupNode>(nodeId);

      if (node instanceof Error) return;

      return {
        id: nodeId,
        type: this.type,
        name: node.name,
        value: answer.map((answer) => answer.answers),
      } satisfies IGroupNodeVariable;
    };
}
