import { Condition } from "../type-classes";
import { v4 as uuid } from "uuid";

export type NewConditionData = {
  inputId: string;
  answer: string;
};

export function createCondition(
  condition: NewConditionData
): Condition.TSelectCondition {
  return {
    id: uuid(),
    type: "select",
    ...condition,
  };
}
