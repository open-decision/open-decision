import { z } from "zod";
import { VariablePlugin } from "@open-decision/plugins-variable-helpers";
import { merge } from "remeda";

export const Value = z.undefined();

export const DataType = z.object({});

const typeName = "empty-variable";

export class EmptyVariablePlugin extends VariablePlugin<
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

export type TEmptyVariable = z.infer<EmptyVariablePlugin["Type"]>;
