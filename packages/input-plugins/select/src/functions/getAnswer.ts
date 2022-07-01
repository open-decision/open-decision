import { TSelectInput } from "../selectPlugin";

export const getAnswer = (input: TSelectInput, answerId: string) => {
  return input.answers.find(({ id }) => id === answerId);
};
