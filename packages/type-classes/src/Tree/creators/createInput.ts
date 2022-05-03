import { Input } from "../type-classes";
import { v4 as uuid } from "uuid";

export type NewInputData = {
  type?: Input.TInput["type"];
  answers: Input.TInput["answers"];
};

export function createInput(input?: NewInputData): Input.TInput {
  return { id: uuid(), type: "select", answers: [], ...input };
}
