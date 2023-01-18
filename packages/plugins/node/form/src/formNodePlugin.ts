import {
  addInput,
  getInputByNode,
  getNodesByInput,
  TInputId,
} from "@open-decision/plugins-node-helpers";
import {
  TReadOnlyTreeClient,
  TTreeClient,
  INodePlugin,
  NodePluginWithVariable,
  TNodeId,
  TEdgeId,
  IVariablePlugin,
} from "@open-decision/tree-type";
import { ODProgrammerError } from "@open-decision/type-classes";
import { DirectEdgePlugin } from "@open-decision/plugins-edge-direct";
import { formNodeInputPlugins, TFormNodeInput } from "./FormNodeInputs";
import {
  RecordVariablePlugin,
  IRecordVariable,
} from "packages/plugins/variables/record/src";
import { match } from "ts-pattern";
import { EmptyVariablePlugin } from "packages/plugins/variables/empty/src";
import { MultiSelectVariablePlugin } from "packages/plugins/variables/multi-select/src";
import { SelectVariablePlugin } from "packages/plugins/variables/select/src";
import { TextVariablePlugin } from "packages/plugins/variables/text/src";
import { TRichText } from "@open-decision/rich-text-editor";
import { forEachObj, fromPairs, isDefined } from "remeda";

const TextVariable = new TextVariablePlugin();
const SelectVariable = new SelectVariablePlugin();
const MultiSelectVariable = new MultiSelectVariablePlugin();
const EmptyVariable = new EmptyVariablePlugin();

const RecordVariable = new RecordVariablePlugin();
const DirectEdge = new DirectEdgePlugin();

export type TFormNodeVariable = IRecordVariable<TNodeId>;

export const typeName = "form" as const;

export interface IFormNode extends INodePlugin<typeof typeName> {
  content?: TRichText;
  inputs: TInputId[];
}

export class FormNodePlugin extends NodePluginWithVariable<
  IFormNode,
  TFormNodeVariable
> {
  inputPlugins = formNodeInputPlugins;

  constructor() {
    super(typeName);
  }

  create =
    ({
      position = { x: 0, y: 0 },
      inputs = [],
      ...data
    }: Omit<IFormNode, "id" | "type">) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return treeClient.nodes.create.node<IFormNode>({
        type: this.type,
        position,
        inputs,
        ...data,
      });
    };

  updateNodeContent =
    (nodeId: TNodeId, content: IFormNode["content"]) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (!node) return;

      node.content = content;
    };

  reorderInputs =
    (nodeId: TNodeId, newInputs: TInputId[]) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (!node) return;

      node.inputs = newInputs;
    };

  connectInputAndNode =
    (nodeId: TNodeId, inputId: TInputId) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (!node) return;

      // We get the input just to validate that it exists.
      treeClient.pluginEntity.get.single("inputs", inputId);

      node.inputs.push(inputId);
    };

  disconnectInputAndNode =
    (nodeId: TNodeId, inputId: TInputId) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (!node) return;

      const inputIndex = node.inputs?.findIndex((id) => id === inputId);

      if (!(inputIndex !== null)) return;

      node.inputs?.splice(inputIndex, 1);
    };

  updateTarget =
    ({
      nodeId,
      newTarget: newItem,
      edgeId,
    }: {
      nodeId: TNodeId;
      newTarget: TNodeId;
      edgeId?: TEdgeId;
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

  inputs = {
    getByNode: getInputByNode<IFormNode, TFormNodeInput>(this),
    add: addInput,
  };

  getByInput = getNodesByInput(this);

  private createInputVariable = (
    input: TFormNodeInput,
    value?: string | string[]
  ) => {
    return match(input)
      .with({ type: "text" }, () => {
        if (value && typeof value !== "string")
          return new ODProgrammerError({
            code: "REQUESTED_ANSWER_OF_WRONG_TYPE",
          });

        return TextVariable.create({
          value,
          id: input.id,
          name: input.label,
        });
      })
      .with({ type: "select" }, (input) => {
        if (value && typeof value !== "string")
          return new ODProgrammerError({
            code: "REQUESTED_ANSWER_OF_WRONG_TYPE",
          });

        return SelectVariable.create({
          values: input.answers,
          value,
          id: input.id,
          name: input.label,
        });
      })
      .with({ type: "multi-select" }, (input) => {
        if (typeof value === "string")
          return new ODProgrammerError({
            code: "REQUESTED_ANSWER_OF_WRONG_TYPE",
          });

        return MultiSelectVariable.create({
          values: input.answers,
          value,
          id: input.id,
          name: input.label,
        });
      })
      .with({ type: "placeholder" }, () =>
        EmptyVariable.create({ id: input.id, name: input.label })
      )
      .run();
  };

  createVariable =
    (nodeId: TNodeId, answer: Record<TInputId, string | string[]>) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (!node) return;

      const variables: IRecordVariable["value"] = {};

      forEachObj.indexed(answer, (value, key) => {
        const input = treeClient.pluginEntity.get.single<TFormNodeInput>(
          "inputs",
          key
        );

        if (!input) return;

        const variableValue = this.createInputVariable(input, value);

        if (variableValue instanceof ODProgrammerError) return;

        variables[variableValue.escapedName] = variableValue;
      });

      return RecordVariable.create({
        value: variables,
        name: node.name,
        id: nodeId,
      });
    };

  createDefaultValues =
    (
      nodeId: TNodeId,
      previousVariable?: IVariablePlugin<string, `${string}_${string}`>
    ) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (!node) return;

      return fromPairs(
        node.inputs
          .map((inputId) => {
            const input = treeClient.pluginEntity.get.single<TFormNodeInput>(
              "inputs",
              inputId
            );

            if (!input) return undefined;

            const variable = this.createInputVariable(input);

            if (variable instanceof ODProgrammerError) return undefined;

            return [inputId, previousVariable?.value ?? variable.value] as [
              string,
              any
            ];
          })
          .filter(isDefined)
      );
    };
}
