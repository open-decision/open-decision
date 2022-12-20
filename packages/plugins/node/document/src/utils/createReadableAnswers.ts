import { TAnswer } from "@open-decision/interpreter";
import { MultiSelectVariablePlugin } from "@open-decision/plugins-variable-multi-select";
import { SingleSelectVariablePlugin } from "@open-decision/plugins-variable-select";
import { TextVariablePlugin } from "@open-decision/plugins-variable-text";
import { z } from "zod";
import { ODProgrammerError } from "@open-decision/type-classes";
import {
  TReadOnlyTreeClient,
  TreeClient,
  TTreeClient,
} from "@open-decision/tree-type";
import { formNodeInputType } from "@open-decision/plugins-node-form";
import { createReadableKey } from "@open-decision/plugins-node-helpers";
import { DecisionNodePlugin } from "@open-decision/plugins-node-decision";
import { GroupNodePlugin } from "@open-decision/node-editor";

const DecisionNode = new DecisionNodePlugin();
const GroupNode = new GroupNodePlugin();

const SingleSelectVariable = new SingleSelectVariablePlugin();
const MultiSelectVariable = new MultiSelectVariablePlugin();
const TextVariable = new TextVariablePlugin();

const FormAnswer = z.object({
  type: z.literal("form"),
  answers: z.record(
    z.union([
      SingleSelectVariable.Type,
      TextVariable.Type,
      MultiSelectVariable.Type,
    ])
  ),
});

type FormAnswerType = Record<
  string,
  string | (string | undefined)[] | undefined
>;

const DecisionAnswer = SingleSelectVariable.Type;

type DecisionAnswerType = string;

const GroupAnswer = z.object({
  type: z.literal("group"),
  answers: z.array(z.record(z.union([FormAnswer, DecisionAnswer]))),
});

type GroupAnswerType = Record<string, FormAnswerType | DecisionAnswerType>[];

const AllAnswerTypes = z.union([FormAnswer, DecisionAnswer, GroupAnswer]);

const getValidAnswer = (answer: any) => {
  const validAnswer = AllAnswerTypes.safeParse(answer);

  if (!validAnswer.success) {
    console.error(validAnswer.error);
    throw new ODProgrammerError({
      code: "INVALID_ANSWER_TYPE",
      message:
        "An invalid answer type exists on the result. This is an internal error. Tell the developers.",
    });
  }
  return validAnswer.data;
};

//FIXME this is temporary until we can determine where this logic should live
export function createReadableAnswers(
  answers: TAnswer,
  treeClient: TTreeClient | TReadOnlyTreeClient
) {
  const result: Record<
    string,
    FormAnswerType | DecisionAnswerType | GroupAnswerType
  > = {};

  for (const answerId in answers) {
    const answer = answers[answerId];
    const parsedAnswer = getValidAnswer(answer);

    switch (parsedAnswer.type) {
      case "form": {
        const [key, value] = createReadableFormAnswer(
          answerId,
          parsedAnswer,
          treeClient
        );

        result[key] = value;
        break;
      }

      case "single-select-variable": {
        const node = DecisionNode.get.single(answerId)(treeClient);

        if (!node) break;

        const value = createReadableDecisionAnswer(parsedAnswer);

        const readableKey = createReadableKey(node["name"] ?? "");

        result[readableKey] = value;

        break;
      }

      case "group": {
        const nodeName = treeClient.nodes.get.single(answerId).name;
        const readableKey = createReadableKey(nodeName ?? "");

        const readableGroupAnswer = createReadableGroupAnswer(
          answerId,
          parsedAnswer,
          treeClient
        );

        result[readableKey] = readableGroupAnswer;
        break;
      }

      default:
        break;
    }
  }

  return result;
}

const createReadableFormAnswer = (
  nodeId: string,
  answer: z.infer<typeof FormAnswer>,
  treeClient: TTreeClient | TReadOnlyTreeClient
) => {
  const formResult: FormAnswerType = {};
  const nodeName = treeClient.nodes.get.single(nodeId).name;
  const readableKey = createReadableKey(nodeName ?? "");

  for (const answerId in answer.answers) {
    const subAnswer = answer.answers[answerId];

    const input = treeClient.pluginEntity.get.single<typeof formNodeInputType>(
      "inputs",
      answerId
    );

    const readableKey = createReadableKey(input.label ?? "");

    if ("values" in subAnswer.data) {
      if (!subAnswer.data.value) {
        formResult[readableKey] = undefined;
      } else {
        const values = subAnswer.data.values;
        const valueArray =
          typeof subAnswer.data.value !== "string"
            ? subAnswer.data.value
            : [subAnswer.data.value];

        const readableValues = valueArray.map((value) => {
          return values.find((item) => item.id === value)?.value;
        });

        formResult[readableKey] = readableValues;
      }
    } else {
      if (subAnswer.data.value) {
        formResult[readableKey] = subAnswer.data.value;
      }
    }
  }

  return [readableKey, formResult] as const;
};

const createReadableDecisionAnswer = (
  answer: z.infer<typeof DecisionAnswer>
) => {
  const readableValue = answer.data.values.find(
    (item) => item.id === answer.data.value
  )?.value;

  return readableValue ?? "";
};

const createReadableGroupAnswer = (
  nodeId: string,
  answerArray: z.infer<typeof GroupAnswer>,
  treeClient: TTreeClient | TReadOnlyTreeClient
) => {
  const result: GroupAnswerType = [];

  const groupNode = GroupNode.get.single(nodeId)(treeClient);

  const subTreeClient = new TreeClient(groupNode.data.tree);

  answerArray.answers.forEach((answer) => {
    const results: Record<string, FormAnswerType | DecisionAnswerType> = {};
    for (const answerId in answer) {
      const singleAnswer = answer[answerId];

      switch (singleAnswer.type) {
        case "form": {
          const [key, value] = createReadableFormAnswer(
            answerId,
            singleAnswer,
            subTreeClient
          );

          results[key] = value;
          break;
        }

        case "single-select-variable": {
          const nodes = DecisionNode.getNodesByInput(answerId)(subTreeClient);

          if (!nodes) break;

          Object.values(nodes).forEach((node) => {
            const value = createReadableDecisionAnswer(singleAnswer);
            const readableKey = createReadableKey(node["name"] ?? "");

            results[readableKey] = value;
          });

          break;
        }

        default:
          break;
      }
    }

    result.push(results);
  });

  return result;
};
