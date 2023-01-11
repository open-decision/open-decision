import { z } from "zod";
import {
  VariablePlugin,
  VariablePluginBaseType,
  VariableType,
} from "@open-decision/tree-type";

const DataType = z.object({});

const typeName = "empty-variable";

export const EmptyVariableType = VariablePluginBaseType(typeName, DataType);

export type IEmptyVariable = VariableType<typeof EmptyVariableType>;

export class EmptyVariablePlugin extends VariablePlugin<IEmptyVariable> {}
