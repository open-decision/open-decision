import { InputWithAnswers } from "./sharedTypes";

export const getAnswer =
  <TType extends InputWithAnswers>() =>
  (input: TType, answerId: string) => {
    return input.answers?.find(({ id }) => id === answerId);
  };