import { TTreeClient } from "@open-decision/tree-type";
import { TInputId } from "../../InputPlugin";
import { getInput } from "../inputMethods";
import { InputWithAnswers } from "./sharedTypes";

export const deleteAnswer =
  <TType extends InputWithAnswers>() =>
  (inputId: TInputId, answerId: string) =>
  (treeClient: TTreeClient) => {
    const input = getInput<TType>()(inputId)(treeClient);

    if (!input) return;

    const answerIndex = input.answers?.findIndex(({ id }) => id === answerId);

    if (!(answerIndex !== null)) return;

    input.answers?.splice(answerIndex, 1);
  };
