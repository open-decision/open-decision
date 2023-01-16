import { TNodeId, TTreeClient } from "@open-decision/tree-type";
import { getInput } from "../inputMethods";
import { InputWithAnswers } from "./sharedTypes";
import { getAnswer } from "./getAnswer";
import { TInputId } from "../../InputPlugin";

export const updateAnswer =
  <TType extends InputWithAnswers>() =>
  (inputId: TInputId, answerId: string, newValue: TNodeId) =>
  (treeClient: TTreeClient) => {
    const input = getInput<TType>()(inputId)(treeClient);
    if (!input) return;

    const answer = getAnswer<TType>()(input, answerId);

    if (!answer) return;

    answer.value = newValue;
  };
