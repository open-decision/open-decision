import { TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";
import {
  CompareConditionPlugin,
  TCompareCondition,
} from "@open-decision/condition-plugins-compare";
import { v4 as uuid } from "uuid";
import { InputPlugin } from "@open-decision/input-plugins-helpers";

export const typeName = "select" as const;
export const Answer = z.object({ id: z.string().uuid(), text: z.string() });

export const DataType = z.object({
  answers: z.array(Answer).default([]),
});

export type TAnswer = z.infer<typeof Answer>;

export type TSelectInput = z.infer<SelectInputPlugin["Type"]>;

export class SelectInputPlugin extends InputPlugin<
  typeof DataType,
  typeof typeName
> {
  declare comparePlugin: CompareConditionPlugin;
  constructor(treeClient: TTreeClient) {
    super(treeClient, DataType, typeName);

    this.comparePlugin = new CompareConditionPlugin(treeClient);
  }

  createAnswer(answer: Pick<TAnswer, "text">) {
    return { id: uuid(), ...answer };
  }

  getAnswer(input: z.infer<typeof this.Type>, answerId: string) {
    return input.data.answers.find(({ id }) => id === answerId);
  }

  addAnswer(inputId: string, answer: TAnswer) {
    const input = this.get(inputId);

    if (!input) return;

    input.data.answers.push(answer);
  }

  updateAnswer(inputId: string, answerId: string, newValue: string) {
    const input = this.get(inputId);
    if (!input) return;

    const answer = this.getAnswer(input, answerId);

    if (!answer) return;

    answer.text = newValue;
  }

  reorderAnswers = (input: TSelectInput) => (newAnswers: TAnswer[]) => {
    input.data.answers = newAnswers;
  };

  deleteAnswer(inputId: string, answerId: string) {
    const input = this.get(inputId);

    if (!input) return;

    const answerIndex = input.data.answers.findIndex(
      ({ id }) => id === answerId
    );

    input.data.answers.splice(answerIndex, 1);

    // When an Input is deleted all conditions using it need to be removed.
    this.treeClient.conditions.delete(
      Object.values(this.treeClient.conditions.get.all() ?? {})
        .filter<TCompareCondition>(this.comparePlugin.isType)
        .filter((condition) => condition.data.answerId === answerId)
        .map((condition) => condition.id)
    );
  }

  updateTarget({
    nodeId,
    inputId,
    answerId,
    newItem,
    edgeId,
  }: {
    nodeId: string;
    inputId: string;
    answerId: string;
    newItem: string;
    edgeId?: string;
  }) {
    const edge = edgeId ? this.treeClient.edges.get.single(edgeId) : undefined;

    if (!edge?.target && newItem) {
      const newCondition = this.comparePlugin.create(inputId, {
        answerId,
      });

      this.treeClient.conditions.add(newCondition);
      this.treeClient.conditions.connect.toInput(newCondition.id, inputId);

      const newEdge = this.treeClient.edges.create({
        source: nodeId,
        target: newItem,
        conditionId: newCondition.id,
      });

      if (newEdge instanceof Error) return;

      this.treeClient.edges.add(newEdge);
    }

    if (edge?.target && newItem)
      this.treeClient.edges.connect.toTargetNode(edge.id, newItem);
  }

  createTargetNode(
    nodeId: string,
    inputId: string,
    answerId: string,
    data: { name: string }
  ) {
    const childNode = this.treeClient.nodes.create.childNode(nodeId, {
      name: data.name,
      data: { inputs: [], ...data },
    });

    if (childNode instanceof Error) return childNode;

    const newCondition = this.comparePlugin.create(inputId, {
      answerId,
    });

    const newEdge = this.treeClient.edges.create({
      source: nodeId,
      target: childNode.id,
      conditionId: newCondition.id,
    });

    if (newEdge instanceof Error) return newEdge;

    this.treeClient.conditions.add(newCondition);
    this.treeClient.conditions.connect.toInput(newCondition.id, inputId);
    this.treeClient.edges.add(newEdge);

    this.treeClient.nodes.add(childNode);

    return { id: childNode.id, label: childNode.name };
  }

  getInputsWithAnswers(
    inputs: TSelectInput[]
  ): Record<string, TSelectInput> | undefined {
    if (!inputs) return undefined;

    const filteredInputs = Object.values(inputs).reduce(
      function filterInputsWithoutAnswer(previousValue, input) {
        if (input.data.answers?.length > 0) previousValue[input.id] = input;

        return previousValue;
      },
      {} as Record<string, TSelectInput>
    );

    if (Object.values(filteredInputs).length === 0) return undefined;

    return filteredInputs;
  }
}
