import { TSelectInput } from "../selectPlugin";
import { TAnswer } from "../types";

export const reorderAnswers =
  (input: TSelectInput) => (newAnswers: TAnswer[]) => {
    input.answers = newAnswers;
  };
