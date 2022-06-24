import { TTreeClient } from "@open-decision/type-classes";
import { TSelectInput } from "../types";

export const getAnswer = (input: TSelectInput, answerId: string) => {
  return input.answers.find(({ id }) => id === answerId);
};
