import { TAnswer } from "../..";
import { getInput } from "../inputMethods";
import { TTreeClient } from "@open-decision/tree-type";
import { InputWithAnswers } from "./sharedTypes";

export const addAnswer =
  <TType extends InputWithAnswers>() =>
  (inputId: string, answer: TAnswer) =>
  (treeClient: TTreeClient) => {
    const input = getInput<TType>()(inputId)(treeClient);

    if (input instanceof Error) return;

    if (!input.answers) input.answers = [];

    input.answers.push(answer);
  };
