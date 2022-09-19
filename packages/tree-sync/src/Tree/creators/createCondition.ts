import { v4 as uuid } from "uuid";
import { merge } from "remeda";

/**
 * You almost certainly do not want to use this directly, but use a plugin instead.
 * This is a low-level function that is used by plugins to create a new node.
 * @param data can be anything as long as it includes a type property
 * @returns the data merged with a unique id
 */
export function createCondition<TData extends { type: string }>(
  data?: TData
): TData & { id: string } {
  return merge(data, {
    id: uuid(),
  });
}
