import { v4 as uuid } from "uuid";
import { merge } from "remeda";

export function createCondition<TData>(data?: TData): TData & { id: string } {
  return merge(data, {
    id: uuid(),
  });
}
