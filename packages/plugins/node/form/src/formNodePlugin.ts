import {
  addInput,
  getInputByNode,
  getNodesByInput,
} from "@open-decision/plugins-node-helpers";
import {
  INodePlugin,
  NodePlugin,
  NodePluginWithVariable,
  TReadOnlyTreeClient,
  TTreeClient,
} from "@open-decision/tree-type";
import { ODProgrammerError } from "@open-decision/type-classes";
import { DirectEdgePlugin } from "@open-decision/plugins-edge-direct";
import { formNodeInputPlugins, TFormNodeInput } from "./FormNodeInputs";
import {
  RecordVariablePlugin,
  TRecordVariable,
} from "@open-decision/plugins-variable-record";
import { match } from "ts-pattern";
import { EmptyVariablePlugin } from "@open-decision/plugins-variable-empty";
import { ListVariablePlugin } from "@open-decision/plugins-variable-list";
import { SelectVariablePlugin } from "@open-decision/plugins-variable-select";
import { TextVariablePlugin } from "@open-decision/plugins-variable-text";
import { TRichText } from "@open-decision/rich-text-editor";

const TextVariable = new TextVariablePlugin();
const SelectVariable = new SelectVariablePlugin();
const ListVariable = new ListVariablePlugin();
const EmptyVariable = new EmptyVariablePlugin();

const RecordVariable = new RecordVariablePlugin();
const DirectEdge = new DirectEdgePlugin();

export type TFormNodeVariable = TRecordVariable;

export const typeName = "form" as const;

export interface IFormNode extends INodePlugin<typeof typeName> {
  content?: TRichText;
  inputs: string[];
}

export class FormNodePlugin
  extends NodePlugin<IFormNode>
  implements NodePluginWithVariable<TFormNodeVariable>
{
  inputPlugins = formNodeInputPlugins;

  constructor() {
    super(typeName);
  }

  create =
    ({ position = { x: 0, y: 0 }, ...data }: Omit<IFormNode, "id" | "type">) =>
    (_treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return {
        id: crypto.randomUUID(),
        type: this.type,
        position,
        ...data,
      } satisfies IFormNode;
    };

  updateNodeContent =
    (nodeId: string, content: IFormNode["content"]) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      node.content = content;
    };

  reorderInputs =
    (nodeId: string, newInputs: string[]) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      node.inputs = newInputs;
    };

  connectInputAndNode =
    (nodeId: string, inputId: string) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      // We get the input just to validate that it exists.
      treeClient.pluginEntity.get.single("inputs", inputId);

      node.inputs.push(inputId);
    };

  disconnectInputAndNode =
    (nodeId: string, inputId: string) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      const inputIndex = node.inputs?.findIndex((id) => id === inputId);

      if (!(inputIndex !== null)) return;

      node.inputs?.splice(inputIndex, 1);
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

      if (edge instanceof Error) return;

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

  get inputs() {
    return {
      getByNode: getInputByNode<IFormNode, TFormNodeInput>(this),
      add: addInput,
    };
  }

  getByInput = getNodesByInput(this);

  getVariable = (nodeId: string, answers: any) => {
    return answers[nodeId] as TFormNodeVariable | undefined;
  };

  createVariable =
    (nodeId: string, answer: any) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) return undefined;

      const variables: TRecordVariable["value"] = {};

      for (const key in answer) {
        const value = answer[key];

        const input = treeClient.pluginEntity.get.single<TFormNodeInput>(
          "inputs",
          key
        );

        if (input instanceof ODProgrammerError) continue;

        const variable = match(input)
          .with({ type: "text" }, () =>
            TextVariable.create({ value, id: input.id })
          )
          .with({ type: "select" }, (input) =>
            SelectVariable.create({
              values: input.answers,
              value,
              id: input.id,
            })
          )
          .with({ type: "multi-select" }, (input) =>
            ListVariable.create({
              values: input.answers,
              value,
              id: input.id,
            })
          )
          .with({ type: "placeholder" }, () =>
            EmptyVariable.create({ id: input.id })
          )
          .run();

        if (variable instanceof ODProgrammerError) continue;

        variables[input.id] = variable;
      }

      return RecordVariable.create({
        value: variables,
        name: node.name,
        id: nodeId,
      });
    };
}
