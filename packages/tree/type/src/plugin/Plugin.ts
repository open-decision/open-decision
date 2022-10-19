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
  treeClient: TTreeClient;
  typeName: TTypeName;
  Type: TType;

  constructor(treeClient: TTreeClient, Type: TType) {
    this.treeClient = treeClient;
    this.Type = Type;
    this.typeName = this.Type.shape.type.value;
  }

  isType(entity: any): entity is z.infer<typeof this.Type> {
    return this.Type.safeParse(entity).success;
  }

  isRecordOfType(
    entities: any
  ): entities is z.infer<z.ZodRecord<z.ZodString, typeof this.Type>> {
    return z.record(this.Type).safeParse(entities).success;
  }
}
