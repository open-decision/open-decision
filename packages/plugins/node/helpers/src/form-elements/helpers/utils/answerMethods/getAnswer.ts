import { z } from "zod";
import { InputWithAnswers } from "./sharedTypes";

export const getAnswer =
  <TType extends InputWithAnswers>(_Type: TType) =>
  (input: z.infer<TType>, answerId: string) => {
    return input.data.answers?.find(({ id }) => id === answerId);
  };
