import { TAnswer, TSelectInput } from "../types";

export const reorderAnswers =
  (input: TSelectInput) => (newAnswers: TAnswer[]) => {
    input.answers = newAnswers;
  };
