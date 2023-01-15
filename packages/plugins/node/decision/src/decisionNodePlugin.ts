import { RichText } from "@open-decision/rich-text-editor";
import {
  deleteEntityFn,
  NodePluginBaseType,
  TReadOnlyTreeClient,
  TTreeClient,
  EntityPluginType,
  NodePluginWithVariable,
} from "@open-decision/tree-type";
import { z } from "zod";
import {
  DecisionNodeInputPlugins,
  TDecisionNodeInputs,
} from "./createInputPlugins";
import { ODProgrammerError } from "@open-decision/type-classes";
import {
  addInput,
  getInputByNode,
  getNodesByInput,
} from "@open-decision/plugins-node-helpers";
import { SelectVariablePlugin } from "@open-decision/plugins-variable-select";
import { match } from "ts-pattern";

const SelectVariable = new SelectVariablePlugin();

export const typeName = "decision" as const;

const DataType = z.object({
  content: RichText.optional(),
  input: z.string().optional(),
});

export const DecisionNodePluginType = NodePluginBaseType(typeName, DataType);

export type TDecisionNode = EntityPluginType<typeof DecisionNodePluginType>;
export type TDecisionNodeVariable = z.infer<DecisionNodePlugin["VariableType"]>;

export class DecisionNodePlugin extends NodePluginWithVariable<
  TDecisionNode,
  typeof SelectVariable.Type
> {
  inputPlugins = DecisionNodeInputPlugins;

  constructor() {
    super(typeName, DecisionNodePluginType, {});
  }

  VariableType = SelectVariable.Type;

  inputs = {
    getByNode: getInputByNode<TDecisionNodeInputs>(this),
    add: addInput,
  };

  getByInput = getNodesByInput(this);

  connectInputAndNode =
    (nodeId: string, inputId: string) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      // We get the input just to validate that it exists.
      treeClient.pluginEntity.get.single("inputs", inputId);

      node.data.input = inputId;
    };

  disconnectInputAndNode = (nodeId: string) => (treeClient: TTreeClient) => {
    const node = this.getSingle(nodeId)(treeClient);

    if (node instanceof Error) throw node;

    delete node.data.input;
  };

  updateData =
    (nodeId: string, data: Partial<TDecisionNode["data"]>) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      node.data = {
        ...node.data,
        ...data,
      };
    };

  updateInput = (nodeId: string, newInputId: string) => {
    return this.updateData(nodeId, { input: newInputId });
  };

  updateNodeContent =
    (nodeId: string, content: TDecisionNode["data"]["content"]) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      node.data.content = content;
    };

  override delete: deleteEntityFn =
    (ids: string[]) => (treeClient: TTreeClient) => {
      const nodes = this.getCollection(ids)(treeClient);

      if (!nodes) return;

      treeClient.nodes.delete(ids);

      for (const id in nodes) {
        const value = nodes[id];

        const edges = treeClient.edges.get.byNode(id);
        treeClient.edges.delete(
          [
            ...Object.values(edges?.source ?? {}),
            ...Object.values(edges?.target ?? {}),
          ]
            .filter((edge) => edge.source === id || edge.target === id)
            .map((edge) => edge.id)
        );

        if (value.data.input) {
          DecisionNodeInputPlugins.select.plugin.delete([value.data.input])(
            treeClient
          );
        }
      }
    };

  createVariable =
    (nodeId: string, answer: string) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) return node;
      if (!node.data.input) return undefined;

      const input = treeClient.pluginEntity.get.single<TDecisionNodeInputs>(
        "inputs",
        node.data.input
      );

      if (input instanceof ODProgrammerError) return input;

      return match(input)
        .with({ type: "select" }, (input) =>
          SelectVariable.create(node, {
            value: answer,
            values: input.data.answers,
          })
        )
        .run();
    };
}
