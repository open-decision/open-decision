import { z } from "zod";
import { VariablePlugin, VariableType } from "@open-decision/tree-type";

const DataType = z.object({});

const typeName = "empty-variable";

export type IEmptyVariable = VariableType<EmptyVariablePlugin["Type"]>;

export class EmptyVariablePlugin extends VariablePlugin {
  constructor() {
    super(typeName, DataType, {});
  }
}
