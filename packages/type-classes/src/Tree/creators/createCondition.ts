import { Condition } from "../type-classes";
import { v4 as uuid } from "uuid";

export function createCondition(): Condition.TCondition {
  return {
    id: uuid(),
  };
}
