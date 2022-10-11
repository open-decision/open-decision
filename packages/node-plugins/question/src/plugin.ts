import { RichText } from "@open-decision/rich-text-editor";
import { Condition, TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";
import { NodePlugin } from "@open-decision/node-editor";
import { isEmpty } from "ramda";

export const typeName = "question" as const;

export const DataType = z.object({
  content: RichText.optional(),
  inputs: z.array(z.string()),
});

export class QuestionNodePlugin extends NodePlugin<
  typeof DataType,
  typeof typeName
> {
  constructor(treeClient: TTreeClient) {
    super(treeClient, DataType, typeName);
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
      this.treeClient.inputs.delete(node.data.inputs);
    }
  }

  connectInputAndNode(nodeId: string, inputId: string) {
    const node = this.get(nodeId);

    if (!node) return;

    // We get the input just to validate that it exists.
    this.treeClient.inputs.get.single(inputId);

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
      const inputs = this.treeClient.inputs.get.collection(node.data.inputs);

      // Instead of returning an empty object, return undefined. This is more meaningful and
      // easier to handle downstream.
      if (isEmpty(inputs)) return undefined;
      return inputs;
    }

    return undefined;
  }

  /**
   * Provide a condition id and receive the nodes that are related to it.
   * Returns undefined if there are no nodes.
   */
  getNodesByCondition(conditionId: string) {
    const input = this.treeClient.inputs.get.byCondition(conditionId);
    if (!input) return undefined;

    return this.getNodesByInput(input.id);
  }

  /**
   * Provide a node id and receive the conditions that are related to it.
   * Returns undefined if there are no conditions.
   */
  getConditionsByNode(nodeId: string) {
    const node = this.treeClient.nodes.get.single(nodeId);
    const inputs = Object.values(this.getInputsByNode(node.id) ?? {}).map(
      (input) => input.id
    );
    const conditions = this.treeClient.conditions.get.all();

    // We loop over the conditions and check if the input is present on the condition.
    const relatedConditions: Condition.TRecord = {};
    for (const key in conditions) {
      const condition = conditions[key];

      if (condition.inputId && inputs.includes(condition.inputId))
        relatedConditions[key] = condition;
    }

    // If the resulting conditions are empty we return undefined, because it is more meaningful and
    // easier to handle downstream.
    if (isEmpty(relatedConditions)) return undefined;

    return relatedConditions;
  }
}

export type TQuestionNode = z.infer<QuestionNodePlugin["Type"]>;
