import { TTreeClient } from "@open-decision/type-classes";
import { get } from "./get";
import { getAnswer } from "./getAnswer";

export const updateAnswer =
  (treeClient: TTreeClient) =>
  (inputId: string, answerId: string, newValue: string) => {
    const input = get(treeClient)(inputId);
    if (!input) return;

    const answer = getAnswer(input, answerId);

    if (!answer) return;

    answer.text = newValue;
  };
