import { TAnswer } from "../../types/answer";
import { getInput } from "../inputMethods";
import { TTreeClient } from "@open-decision/tree-type";
import { InputWithAnswers } from "./sharedTypes";
import { TInputId } from "../../InputPlugin";

export const addAnswer =
  <TType extends InputWithAnswers>() =>
  (inputId: TInputId, answer: TAnswer) =>
  (treeClient: TTreeClient) => {
    const input = getInput<TType>()(inputId)(treeClient);

    if (!input) return;

    if (!input.answers) input.answers = [];

    input.answers.push(answer);
  };
