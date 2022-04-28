import { Input } from "../type-classes";
import { v4 as uuid } from "uuid";

export type NewAnswerData = Pick<Input.TAnswer, "text">;

export const createAnswer = (answer: NewAnswerData) => {
  return { id: uuid(), ...answer };
};
