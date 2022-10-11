import { Condition, TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";
import { ConditionPlugin } from "./ConditionPlugin";
export { ConditionPlugin } from "./ConditionPlugin";
import {
  InterpreterContext,
  EVALUATE_NODE_CONDITIONS,
} from "@open-decision/interpreter";
import { InterpreterError } from "@open-decision/type-classes";

export type ConditionResolver<TCondition extends Condition.TCondition> = (
  treeClient: TTreeClient
) => (
  condition: TCondition
) => (
  context: InterpreterContext,
  event: EVALUATE_NODE_CONDITIONS
) =>
  | { state: "success"; target: string }
  | { state: "failure" }
  | { state: "error"; error: InterpreterError };

export const mergeTypes = <
  TDataType extends z.ZodType,
  TTypeName extends string
>(
  DataType: TDataType,
  typeName: TTypeName
) => Condition.Type.extend({ data: DataType, type: z.literal(typeName) });

export type ConditionPluginObject<
  TType extends z.ZodType,
  TTypeName extends string,
  TCondition extends Condition.TCondition
> = {
  plugin: ConditionPlugin<TType, TTypeName>;
  resolver: ReturnType<ConditionResolver<TCondition>>;
  type: string;
};
