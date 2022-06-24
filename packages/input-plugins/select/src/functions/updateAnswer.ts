import { TTreeClient } from "@open-decision/type-classes";
import { selectPlugin } from "../selectPlugin";

export const updateAnswer =
  (treeClient: TTreeClient) =>
  (inputId: string, answerId: string, newValue: string) => {
    const input = selectPlugin(treeClient).input.select.get(inputId);
    if (input instanceof Error) return;

    const answer = selectPlugin(treeClient).input.select.getAnswer(answerId);

    if (!answer) return;

    answer.text = newValue;
  };
