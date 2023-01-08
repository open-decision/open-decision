import { z } from "zod";
import { VariablePlugin } from "@open-decision/plugins-variable-helpers";
import { merge } from "remeda";

const typeName = "text-variable";

export const DataType = z.object({
  value: z.string().optional(),
});

export class TextVariablePlugin extends VariablePlugin<
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
        type: this.type,
        name,
        id,
      }
    );

    return newVariable;
  };
}

export type TTextVariable = z.infer<TextVariablePlugin["Type"]>;
