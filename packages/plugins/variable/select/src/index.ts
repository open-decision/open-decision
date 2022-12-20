import { z } from "zod";
import { VariablePlugin } from "@open-decision/plugins-variable-helpers";
import { merge } from "remeda";

export const Value = z.object({ id: z.string().uuid(), value: z.string() });

export const DataType = z.object({
  values: z.array(Value).default([]),
  value: z.string().optional(),
});

const typeName = "single-select-variable";

export class SingleSelectVariablePlugin extends VariablePlugin<
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
  ): z.infer<typeof this.Type> => {
    const newVariable = merge(
      { data },
      {
        type: this.typeName,
        name,
        id,
      }
    );

    return newVariable;
  };
}

export type TSingleSelectVariable = z.infer<SingleSelectVariablePlugin["Type"]>;
