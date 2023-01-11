import { RichText } from "@open-decision/rich-text-editor";
import {
  deleteEntityFn,
  TNodePlugin,
  NodePlugin,
  NodePluginBaseType,
  TReadOnlyTreeClient,
  TTreeClient,
} from "@open-decision/tree-type";
import { z } from "zod";
import {
  addInput,
  deleteInput,
  updateInput,
  NodePlugin,
  Input,
  createFn,
} from "@open-decision/plugins-node-helpers";
import {
  createVariableFromInput,
  decisionNodeInputPlugins,
  DecisionNodeVariable,
  TDecisionNodeInputs,
} from "./createInputPlugins";
import { ODProgrammerError } from "@open-decision/type-classes";

export const typeName = "decision" as const;

const DataType = z.object({
  content: RichText.optional(),
  input: z.string().optional(),
});

export const DecisionNodePluginType = NodePluginBaseType(typeName, DataType);

export type TDecisionNodePlugin = TNodePlugin<
  typeof typeName,
  z.infer<typeof DataType>
>;

export class DecisionNodePlugin extends NodePlugin<TDecisionNodePlugin> {
  inputPlugins = decisionNodeInputPlugins;

  constructor() {
    super(typeName, DecisionNodePluginType, {});
  }

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
    (nodeId: string, data: Partial<TDecisionNodePlugin["data"]>) =>
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
    (nodeId: string, content: TDecisionNodePlugin["data"]["content"]) =>
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
          decisionNodeInputPlugins.select.plugin.delete([value.data.input])(
            treeClient
          );
        }
      }
    };

  getVariableByInput = (inputId: string) => (treeClient: TTreeClient) => {
    const input = treeClient.pluginEntity.get.single<TDecisionNodeInputs>(
      "inputs",
      inputId
    );

    if (input instanceof ODProgrammerError) return undefined;

    return input?.id;
  };

  createVariable =
    (nodeId: string, answer: string) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) return undefined;

      if (!node.data.input) return;

      const input = treeClient.pluginEntity.get.single<TDecisionNodeInputs>(
        "inputs",
        node.data.input
      );

      if (input instanceof ODProgrammerError) return undefined;

      const variable = createVariableFromInput(input, answer);

      return variable;
    };

  getAnswer = (nodeId: string, answers: any) => {
    return answers[nodeId] as DecisionNodeVariable | undefined;
  };
}
