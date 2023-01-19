import { DirectEdgePlugin } from "@open-decision/plugins-edge-direct";
import {
  TReadOnlyTreeClient,
  Tree,
  TTreeClient,
  INode,
  NodePluginWithVariable,
  TNodeId,
  TEdgeId,
  createReadableKey,
  createFn,
} from "@open-decision/tree-type";
import { TRichText } from "@open-decision/rich-text-editor";
import { InterpreterContext } from "@open-decision/interpreter";
import { IModuleVariable, IVariable } from "@open-decision/variables";

const DirectEdge = new DirectEdgePlugin();

export const typeName = "node-group" as const;

export interface IGroupNode extends INode<typeof typeName> {
  content?: TRichText;
  cta?: string;
  tree?: Tree.TTree;
  title?: string;
}

export class GroupNodePlugin extends NodePluginWithVariable<
  IGroupNode,
  IModuleVariable
> {
  constructor() {
    super(typeName);
    this.isAddable = false;
  }

  create: createFn<IGroupNode> = (data) => (treeClient) => {
    return treeClient.nodes.create.node<IGroupNode>({
      type: this.type,
      ...data,
    }) satisfies IGroupNode;
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
    return answers[nodeId] as IModuleVariable | undefined;
  };

  createVariable =
    (nodeId: TNodeId, answer: InterpreterContext["variables"][]) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const node = treeClient.nodes.get.single<IGroupNode>(nodeId);

      if (!node) return;

      return {
        id: nodeId,
        type: "module",
        name: node.name,
        escapedName: createReadableKey(node.name),
        value: answer,
      } satisfies IModuleVariable;
    };

  createDefaultValues =
    (_nodeId: TNodeId, previousVariable?: IVariable) =>
    (_treeClient: TTreeClient | TReadOnlyTreeClient) => {
      if (previousVariable && previousVariable.type === "module") {
        return previousVariable.value;
      }

      return [];
    };
}
