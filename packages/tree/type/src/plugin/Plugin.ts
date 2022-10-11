import { z } from "zod";
import { TTreeClient } from "../treeClient";

export class Plugin<
  TTypeName extends string,
  TDataType extends z.ZodType,
  TType extends z.ZodObject<{
    type: z.ZodLiteral<TTypeName>;
    data: TDataType;
    id: z.ZodString;
  }>
> {
  declare treeClient: TTreeClient;
  declare typeName: TTypeName;
  declare Type: TType;

  constructor(treeClient: TTreeClient, Type: TType) {
    this.treeClient = treeClient;
    this.Type = Type;
    this.typeName = this.Type.shape.type.value;
  }

  isType(input: any): input is z.infer<typeof this.Type> {
    return this.Type.safeParse(input).success;
  }

  isRecordOfType(
    inputs: any
  ): inputs is z.infer<z.ZodRecord<z.ZodString, typeof this.Type>> {
    return z.record(this.Type).safeParse(inputs).success;
  }
}
