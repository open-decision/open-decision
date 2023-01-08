import { TTreeClient } from "@open-decision/tree-type";
import { getInput } from "../inputMethods";
import { InputWithAnswers } from "./sharedTypes";

export const deleteAnswer =
  <TType extends InputWithAnswers>(Type: TType) =>
  (inputId: string, answerId: string) =>
  (treeClient: TTreeClient) => {
    const input = getInput(Type)(inputId)(treeClient);

    const answerIndex = input.data.answers?.findIndex(
      ({ id }) => id === answerId
    );

    if (!(answerIndex !== null)) return;

    input.data.answers?.splice(answerIndex, 1);
  };
