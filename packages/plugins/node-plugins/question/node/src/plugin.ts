import { RichText } from "@open-decision/rich-text-editor";
import { TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";
import { NodePlugin } from "@open-decision/node-editor";
import { isEmpty } from "ramda";
import { createInputPlugins } from "./createinputPlugins";
import { deleteInput, getInput } from "@open-decision/input-plugins-helpers";
import { match } from "ts-pattern";
import { ODProgrammerError } from "@open-decision/type-classes";
import { DeepPartial } from "utility-types";

export const typeName = "question" as const;

export const DataType = z.object({
  content: RichText,
  inputs: z.array(z.string()),
});

export class QuestionNodePlugin extends NodePlugin<
  typeof DataType,
  typeof typeName
> {
  declare inputPlugins: ReturnType<typeof createInputPlugins>[0];
  declare inputType: ReturnType<typeof createInputPlugins>[1];

  constructor(treeClient: TTreeClient) {
    super(treeClient, DataType, typeName);

    const inputPlugins = createInputPlugins(treeClient);
    this.inputPlugins = inputPlugins[0];
    this.inputType = inputPlugins[1];
  }

  create(nodeData: Partial<Omit<z.infer<typeof this.Type>, "id" | "type">>) {
    const newNode = this.treeClient.nodes.create.node<
      z.infer<typeof this.Type>
    >({
      ...nodeData,
      type: this.typeName,
      data: {
        content: nodeData.data?.content ?? {},
        inputs: nodeData.data?.inputs ?? [],
      },
    });

    const parsedNode = this.Type.safeParse(newNode);

    if (!parsedNode.success) {
      console.error(parsedNode.error);
      throw new ODProgrammerError({
        code: "INVALID_ENTITY_CREATION",
        message:
          "The question node could not be created. Please check that the data is correct.",
      });
    }

    return parsedNode.data;
  }

  updateNodeContent(
    nodeId: string,
    content: z.infer<typeof this.Type>["data"]["content"]
  ) {
    const node = this.get(nodeId);

    if (!node) return;

    node.data.content = content;
  }

  delete(id: string) {
    const node = this.get(id);

    if (!node) return;

    this.treeClient.nodes.delete([id]);

    const edges = this.treeClient.edges.get.byNode(id);
    this.treeClient.edges.delete(
      [
        ...Object.values(edges?.source ?? {}),
        ...Object.values(edges?.target ?? {}),
      ]
        .filter((edge) => edge.source === id || edge.target === id)
        .map((edge) => edge.id)
    );

    if (node.data.inputs) {
      deleteInput(this.treeClient)(node.data.inputs);
    }
  }

  connectInputAndNode(nodeId: string, inputId: string) {
    const node = this.get(nodeId);

    if (!node) return;

    // We get the input just to validate that it exists.
    getInput(this.treeClient, this.inputType)(inputId);

    node.data.inputs.push(inputId);
  }

  disconnectInputAndNode(nodeId: string, inputId: string) {
    const node = this.get(nodeId);

    if (!node) return;

    const inputIndex = node.data.inputs.findIndex(
      (nodeInputId) => nodeInputId === inputId
    );

    if (inputIndex >= 0) {
      node.data.inputs.splice(inputIndex, 1);
    }
  }

  getNodesByInput(inputId: string) {
    type TNode = z.infer<typeof this.Type>;
    const nodes = this.getN();

    if (!nodes) return undefined;

    const relatedNodes: Record<string, TNode> = {};
    for (const key in nodes) {
      const node = nodes[key];

      if (node.data.inputs.includes(inputId)) {
        relatedNodes[key] = node;
      }
    }

    // If the resulting conditions are empty we return undefined, because it is more meaningful and
    // easier to handle downstream.
    if (isEmpty(relatedNodes)) return undefined;

    return relatedNodes;
  }

  /**
   * Provide a node id and receive the inputs that are related to it.
   * Returns undefined if there are no inputs.
   */
  getInputsByNode(nodeId: string) {
    const node = this.get(nodeId);

    if (node) {
      const inputs = this.treeClient.pluginEntity.get.collection(
        "inputs",
        node.data.inputs,
        this.inputType
      );

      // Instead of returning an empty object, return undefined. This is more meaningful and
      // easier to handle downstream.
      if (isEmpty(inputs)) return undefined;
      return inputs;
    }

    return undefined;
  }

  getVariable(node: TQuestionNode) {
    const inputs = this.getInputsByNode(node.id);

    if (!inputs) return undefined;

    const variables = Object.values(inputs).map((input) =>
      match(input)
        .with({ type: "text" }, (input) =>
          this.inputPlugins.text.plugin.getVariable(input)
        )
        .with({ type: "select" }, (input) =>
          this.inputPlugins.select.plugin.getVariable(input)
        )
        .exhaustive()
    );

    return variables;
  }
}

export type TQuestionNode = z.infer<QuestionNodePlugin["Type"]>;
