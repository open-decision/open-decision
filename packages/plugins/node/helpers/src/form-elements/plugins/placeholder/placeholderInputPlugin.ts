import { z } from "zod";
import { InputPlugin } from "../../helpers";
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
}

export type TPlaceholderInput = z.infer<PlaceholderInputPlugin["Type"]>;
