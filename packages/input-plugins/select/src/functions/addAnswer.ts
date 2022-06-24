import { TTreeClient } from "@open-decision/type-classes";
import { get } from "./get";
import { TAnswer } from "../types";

export const addAnswer =
  (treeClient: TTreeClient) => (inputId: string, answer: TAnswer) => {
    const input = get(treeClient)(inputId);

    if (input instanceof Error) return;

    input.answers.push(answer);
  };
