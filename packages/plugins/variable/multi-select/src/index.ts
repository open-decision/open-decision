import { z } from "zod";
import { VariablePlugin } from "@open-decision/plugins-variable-helpers";
import { merge } from "remeda";

export const Value = z.object({ id: z.string().uuid(), value: z.string() });

export const DataType = z.object({
  values: z.array(Value).default([]),
  value: z.array(z.string()).optional(),
});

const typeName = "multi-select-variable";

export class MultiSelectVariablePlugin extends VariablePlugin<
  typeof DataType,
  typeof typeName
> {
  constructor() {
    super(DataType, typeName);
  }

  create = (
    id: string,
    name: string,
    data: z.infer<typeof this.Type>["data"]
  ): z.infer<typeof this.Type> | undefined => {
    const newVariable = merge({ data }, { type: this.type, name, id });

    return newVariable;
  };
}

export type TMultiSelectVariable = z.infer<MultiSelectVariablePlugin["Type"]>;
