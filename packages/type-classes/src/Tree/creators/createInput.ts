import { v4 as uuid } from "uuid";
import { merge } from "remeda";
import { Input } from "../type-classes";

export function createInput<TData>(data?: TData): TData & Input.TBaseInput {
  return merge(data, { id: uuid() });
}
