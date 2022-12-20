import { RichText } from "@open-decision/rich-text-editor";
import { TReadOnlyTreeClient, TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";
import {
  addInput,
  deleteInput,
  updateInput,
  NodePlugin,
  Input,
} from "@open-decision/plugins-node-helpers";
import {
  createVariableFromInput,
  decisionNodeInputPlugins,
  decisionNodeInputType,
  DecisionNodeVariable,
} from "./createInputPlugins";
import { isEmpty } from "ramda";

export const typeName = "decision" as const;

export const DataType = z.object({
  content: RichText.optional(),
  input: z.string().optional(),
});

export class DecisionNodePlugin extends NodePlugin<
  typeof DataType,
  typeof typeName
> {
  inputType = decisionNodeInputType;
  inputPlugins = decisionNodeInputPlugins;
  constructor() {
    super(DataType, typeName);
    this.defaultData = {};
  }

  getInputByNode =
    (nodeId: string) => (treeClient: TReadOnlyTreeClient | TTreeClient) => {
      const node = this.get.single(nodeId)(treeClient);

      if (!node.data.input) return undefined;

      return treeClient.pluginEntity.get.single<typeof decisionNodeInputType>(
        "inputs",
        node.data.input
      );
    };
  getNodesByInput =
    (inputId: string) => (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      type TNode = z.infer<typeof this.Type>;
      const nodes = this.get.collection()(treeClient);

      if (!nodes) return undefined;

      const relatedNodes: Record<string, TNode> = {};
      for (const key in nodes) {
        const node = nodes[key];

        if (node.data.input === inputId) {
          relatedNodes[key] = node;
        }
      }

      // If the resulting conditions are empty we return undefined, because it is more meaningful and
      // easier to handle downstream.
      if (isEmpty(relatedNodes)) return undefined;

      return relatedNodes;
    };

  updateData =
    (nodeId: string, data: Partial<z.infer<typeof this.Type>["data"]>) =>
    (treeClient: TTreeClient) => {
      const node = this.get.single(nodeId)(treeClient);

      node.data = {
        ...node.data,
        ...data,
      };
    };

  updateInput = (nodeId: string, newInputId: string) => {
    return this.updateData(nodeId, { input: newInputId });
  };

  updateInputType = updateInput;
  addInput = addInput;

  updateInputName =
    (inputId: string, name: string) => (treeClient: TTreeClient) => {
      const inputs =
        treeClient.pluginEntity.get.all<typeof Input.Type>("inputs");

      if (!inputs) return;

      inputs[inputId].name = name;
    };

  updateNodeContent =
    (nodeId: string, content: z.infer<typeof this.Type>["data"]["content"]) =>
    (treeClient: TTreeClient) => {
      const node = this.get.single(nodeId)(treeClient);

      if (!node) return;

      node.data.content = content;
    };

  delete = (id: string) => (treeClient: TTreeClient) => {
    const node = this.get.single(id)(treeClient);

    if (!node) return;

    treeClient.nodes.delete([id]);

    const edges = treeClient.edges.get.byNode(id);
    treeClient.edges.delete(
      [
        ...Object.values(edges?.source ?? {}),
        ...Object.values(edges?.target ?? {}),
      ]
        .filter((edge) => edge.source === id || edge.target === id)
        .map((edge) => edge.id)
    );

    if (node.data.input) {
      deleteInput([node.data.input])(treeClient);
    }
  };

  getVariableByInput = (inputId: string) => (treeClient: TTreeClient) => {
    const input = treeClient.pluginEntity.get.single<
      typeof decisionNodeInputType
    >("inputs", inputId);

    return input?.id;
  };

  createVariable =
    (nodeId: string, answer: string) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const node = this.get.single(nodeId)(treeClient);

      if (!node.data.input) return;

      const input = treeClient.pluginEntity.get.single<typeof this.inputType>(
        "inputs",
        node.data.input
      );

      const variable = createVariableFromInput(input, answer);

      return variable;
    };

  getAnswer = (nodeId: string, answers: any) => {
    return answers[nodeId] as DecisionNodeVariable | undefined;
  };
}

export type TDecisionNode = z.infer<DecisionNodePlugin["Type"]>;
