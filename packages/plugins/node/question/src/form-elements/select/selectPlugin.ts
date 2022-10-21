import { TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { InputPlugin } from "../helpers";
import { SelectVariable } from "packages/plugins/variable/select/src";

export const typeName = "select" as const;
export const Answer = z.object({ id: z.string().uuid(), text: z.string() });

export const DataType = z
  .object({
    answers: z.array(Answer),
  })
  .default({ answers: [] });

export type TAnswer = z.infer<typeof Answer>;

export type TSelectInput = z.infer<SelectInputPlugin["Type"]>;

export class SelectInputPlugin extends InputPlugin<
  typeof DataType,
  typeof typeName,
  typeof SelectVariable
> {
  constructor(treeClient: TTreeClient) {
    super(treeClient, DataType, typeName, SelectVariable);
  }

  createAnswer(answer: Pick<TAnswer, "text">) {
    return { id: uuid(), ...answer };
  }

  getAnswer(input: z.infer<typeof this.Type>, answerId: string) {
    return input.data.answers?.find(({ id }) => id === answerId);
  }

  addAnswer(inputId: string, answer: TAnswer) {
    const input = this.getInput(inputId);

    if (!input) return;

    if (!input.data.answers) input.data.answers = [];

    input.data.answers.push(answer);
  }

  updateAnswer(inputId: string, answerId: string, newValue: string) {
    const input = this.getInput(inputId);
    if (!input) return;

    const answer = this.getAnswer(input, answerId);

    if (!answer) return;

    answer.text = newValue;
  }

  reorderAnswers = (input: TSelectInput) => (newAnswers: TAnswer[]) => {
    input.data.answers = newAnswers;
  };

  deleteAnswer(inputId: string, answerId: string) {
    const input = this.getInput(inputId);

    if (!input) return;

    const answerIndex = input.data.answers?.findIndex(
      ({ id }) => id === answerId
    );

    if (!answerIndex) return;

    input.data.answers?.splice(answerIndex, 1);
  }

  updateTarget({
    nodeId,
    newItem,
    edgeId,
  }: {
    nodeId: string;
    newItem: string;
    edgeId?: string;
  }) {
    const edge = edgeId ? this.treeClient.edges.get.single(edgeId) : undefined;

    if (!edge?.target && newItem) {
      const newEdge = this.treeClient.edges.create({
        source: nodeId,
        target: newItem,
      });

      if (newEdge instanceof Error) return;

      this.treeClient.edges.add(newEdge);
    }

    if (edge?.target && newItem)
      this.treeClient.edges.connect.toTargetNode(edge.id, newItem);
  }

  getInputsWithAnswers(
    inputs: TSelectInput[]
  ): Record<string, TSelectInput> | undefined {
    if (!inputs) return undefined;

    const filteredInputs = Object.values(inputs).reduce(
      function filterInputsWithoutAnswer(previousValue, input) {
        if ((input.data.answers?.length ?? 0) > 0)
          previousValue[input.id] = input;

        return previousValue;
      },
      {} as Record<string, TSelectInput>
    );

    if (Object.values(filteredInputs).length === 0) return undefined;

    return filteredInputs;
  }

  override getVariable(input: TSelectInput) {
    return {
      id: input.id,
      type: this.typeName,
      values: input.data.answers ?? [],
    };
  }
}
