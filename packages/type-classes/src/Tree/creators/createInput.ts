import { Input } from "../type-classes";
import { v4 as uuid } from "uuid";

export function createInput(): Input.TInput {
  return { id: uuid() };
}
