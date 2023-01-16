import { TTreeClient } from "@open-decision/tree-type";
import { ODProgrammerError } from "@open-decision/type-classes";
import { getInput } from "../inputMethods";
import { InputWithAnswers } from "./sharedTypes";

export const deleteAnswer =
  <TType extends InputWithAnswers>() =>
  (inputId: string, answerId: string) =>
  (treeClient: TTreeClient) => {
    const input = getInput<TType>()(inputId)(treeClient);

    if (input instanceof ODProgrammerError) return;

    const answerIndex = input.answers?.findIndex(({ id }) => id === answerId);

    if (!(answerIndex !== null)) return;

    input.answers?.splice(answerIndex, 1);
  };
