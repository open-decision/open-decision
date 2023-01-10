import { z } from "zod";
import { IVariablePluginBase, VariablePlugin } from "@open-decision/tree-type";

export const Value = z.undefined();

export const DataType = z.void();

const typeName = "empty-variable";

export type IEmptyVariable = IVariablePluginBase<
  typeof typeName,
  z.infer<typeof DataType>
>;

export class EmptyVariablePlugin extends VariablePlugin<IEmptyVariable> {}
