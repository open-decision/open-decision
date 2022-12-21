import { TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { MultiSelectVariablePlugin } from "@open-decision/plugins-variable-multi-select";
import { Answer, InputPlugin, TAnswer } from "../../helpers";

export const typeName = "multi-select" as const;

export const DataType = z
  .object({
    answers: z.array(Answer),
  })
  .default({ answers: [] });

const MultiSelectVariable = new MultiSelectVariablePlugin();

export class MultiSelectInputPlugin extends InputPlugin<
  typeof DataType,
  typeof typeName,
  typeof MultiSelectVariable
> {
  constructor() {
    super(DataType, typeName, MultiSelectVariable);
  }

  createAnswer = (answer: Pick<TAnswer, "value">) => {
    return { id: uuid(), ...answer };
  };

  addAnswer =
    (inputId: string, answer: TAnswer) => (treeClient: TTreeClient) => {
      const input = this.getInput(inputId)(treeClient);

      if (!input) return;

      if (!input.data.answers) input.data.answers = [];

      input.data.answers.push(answer);
    };

  getAnswer = (input: TMultiSelectInput, answerId: string) => {
    return input.data.answers?.find(({ id }) => id === answerId);
  };

  updateAnswer =
    (inputId: string, answerId: string, newValue: string) =>
    (treeClient: TTreeClient) => {
      const input = this.getInput(inputId)(treeClient);
      if (!input) return;

      const answer = this.getAnswer(input, answerId);

      if (!answer) return;

      answer.value = newValue;
    };

  reorderAnswers =
    (inputId: string, newAnswers: TAnswer[]) => (treeClient: TTreeClient) => {
      const input = treeClient.pluginEntity.get.single<typeof this.Type>(
        "inputs",
        inputId
      );

      if (!input) return;

      input.data.answers = newAnswers;
    };

  deleteAnswer =
    (inputId: string, answerId: string) => (treeClient: TTreeClient) => {
      const input = this.getInput(inputId)(treeClient);

      const answerIndex = input.data.answers?.findIndex(
        ({ id }) => id === answerId
      );

      if (!(answerIndex !== null)) return;

      input.data.answers?.splice(answerIndex, 1);
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

      if (edge instanceof Error) throw edge;

      if (!edge?.target && newItem) {
        const newEdge = treeClient.edges.create({
          source: nodeId,
          target: newItem,
        });

        if (newEdge instanceof Error) return;

        treeClient.edges.add(newEdge);
      }

      if (edge?.target && newItem)
        treeClient.edges.connect.toTargetNode(edge.id, newItem);
    };
}

export type TMultiSelectInput = z.infer<MultiSelectInputPlugin["Type"]>;
