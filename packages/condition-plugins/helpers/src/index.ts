import { Condition } from "@open-decision/tree-type";
import { z } from "zod";

export { ConditionPlugin } from "./ConditionPlugin";

export const mergeTypes = <
  TDataType extends z.ZodType,
  TTypeName extends string
>(
  DataType: TDataType,
  typeName: TTypeName
) => Condition.Type.extend({ data: DataType, type: z.literal(typeName) });
