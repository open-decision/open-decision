import { TAnswer, Type } from "./types";
import {
  createExtendedTreeClient,
  InputPlugin,
  TBaseTreeClient,
} from "@open-decision/type-classes";
import { z } from "zod";
import {
  ComparePlugin,
  TCompareCondition,
} from "@open-decision/compare-condition-plugin";
import { v4 as uuid } from "uuid";

export type TSelectInput = z.infer<SelectPlugin["MergedType"]>;

export class SelectPlugin extends InputPlugin<typeof Type, "select"> {
  comparePlugin = new ComparePlugin(this.treeClient);
  constructor(treeClient: TBaseTreeClient) {
    super(treeClient, Type, "select");
  }

  createAnswer(answer: Pick<TAnswer, "text">) {
    return { id: uuid(), ...answer };
  }

  getAnswer(input: z.infer<typeof this.MergedType>, answerId: string) {
    return input.answers.find(({ id }) => id === answerId);
  }

  addAnswer(inputId: string, answer: TAnswer) {
    const input = this.get(inputId);

    if (!input) return;

    input.answers.push(answer);
  }

  updateAnswer(inputId: string, answerId: string, newValue: string) {
    const input = this.get(inputId);
    if (!input) return;

    const answer = this.getAnswer(input, answerId);

    if (!answer) return;

    answer.text = newValue;
  }

  reorderAnswers = (input: TSelectInput) => (newAnswers: TAnswer[]) => {
    input.answers = newAnswers;
  };

  deleteAnswer(inputId: string, answerId: string) {
    const input = this.get(inputId);

    if (!input) return;

    const answerIndex = input.answers.findIndex(({ id }) => id === answerId);

    input.answers.splice(answerIndex, 1);

    // When an Input is deleted all conditions using it need to be removed.
    this.treeClient.conditions.delete(
      Object.values(this.treeClient.conditions.get.all() ?? {})
        .filter<TCompareCondition>(this.comparePlugin.isType)
        .filter((condition) => condition.valueId === answerId)
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
      const newCondition = this.comparePlugin.create({
        inputId,
        valueId: answerId,
      });

      this.treeClient.conditions.add(newCondition);
      this.treeClient.nodes.connect.toCondition(nodeId, newCondition.id);

      const newEdge = this.treeClient.edges.create({
        source: nodeId,
        target: newItem,
        conditionId: newCondition.id,
      });

      if (newEdge instanceof Error) return;

      this.treeClient.edges.add(newEdge);
    }

    if (edge?.target && newItem)
      this.treeClient.edges.update.target(edge.id, newItem);
  }

  createTargetNode(
    nodeId: string,
    inputId: string,
    valueId: string,
    data: { name: string }
  ) {
    const childNode = this.treeClient.nodes.create.childNode(nodeId, {
      data: { inputs: [], ...data },
    });

    if (childNode instanceof Error) return childNode;

    const newCondition = this.comparePlugin.create({
      inputId,
      valueId,
    });

    const newEdge = this.treeClient.edges.create({
      source: nodeId,
      target: childNode.id,
      conditionId: newCondition.id,
    });

    if (newEdge instanceof Error) return newEdge;

    this.treeClient.conditions.add(newCondition);
    this.treeClient.nodes.connect.toCondition(nodeId, newCondition.id);
    this.treeClient.edges.add(newEdge);

    this.treeClient.nodes.add(childNode);

    return { id: childNode.id, label: childNode.data.name };
  }

  getInputsWithAnswers(
    inputs: TSelectInput[]
  ): Record<string, TSelectInput> | undefined {
    if (!inputs) return undefined;

    const filteredInputs = Object.values(inputs).reduce(
      function filterInputsWithoutAnswer(previousValue, input) {
        if (input.answers?.length > 0) previousValue[input.id] = input;

        return previousValue;
      },
      {} as Record<string, TSelectInput>
    );

    if (Object.values(filteredInputs).length === 0) return undefined;

    return filteredInputs;
  }
}
