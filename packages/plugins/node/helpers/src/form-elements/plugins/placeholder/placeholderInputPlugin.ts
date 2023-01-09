import { z } from "zod";
import { createFn, InputPlugin } from "../../helpers";
import { EmptyVariablePlugin } from "@open-decision/plugins-variable-empty";

export const typeName = "placeholder" as const;

export const DataType = z.object({});

const EmptyVariable = new EmptyVariablePlugin();

export class PlaceholderInputPlugin extends InputPlugin<
  typeof DataType,
  typeof typeName,
  typeof EmptyVariable
> {
  constructor() {
    super(DataType, typeName, EmptyVariable);

    this.defaultData = {};
  }

  create: createFn<typeof this.Type> = (data) => {
    const newInput = {
      id: crypto.randomUUID(),
      type: this.type,
      required: false,
      ...data,
      data: { ...this.defaultData, ...data?.data },
    };

    return this.parse(newInput);
  };
}

export type TPlaceholderInput = z.infer<PlaceholderInputPlugin["Type"]>;
