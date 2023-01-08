import { TTreeClient } from "@open-decision/tree-type";
import { getInput } from "../inputMethods";
import { InputWithAnswers } from "./sharedTypes";
import { getAnswer } from "./getAnswer";

export const updateAnswer =
  <TType extends InputWithAnswers>(Type: TType) =>
  (inputId: string, answerId: string, newValue: string) =>
  (treeClient: TTreeClient) => {
    const input = getInput(Type)(inputId)(treeClient);
    if (!input) return;

    const answer = getAnswer(Type)(input, answerId);

    if (!answer) return;

    answer.value = newValue;
  };
