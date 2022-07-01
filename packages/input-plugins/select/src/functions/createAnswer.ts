import { v4 as uuid } from "uuid";
import { TAnswer } from "../types";

export type NewAnswerData = Pick<TAnswer, "text">;

export const createAnswer = (answer: NewAnswerData) => {
  return { id: uuid(), ...answer };
};
