import { TAnswer } from "../../types";

export const createAnswer = (answer: Pick<TAnswer, "value">) => {
  return { id: crypto.randomUUID(), ...answer };
};
