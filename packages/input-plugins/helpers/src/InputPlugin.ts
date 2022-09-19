import { Input, TTreeClient } from "@open-decision/tree-sync";
import { z } from "zod";
import { pipe } from "remeda";

const mergeTypes = <
  TType extends z.ZodObject<z.ZodRawShape, any, any>,
  TTypeName extends string
>(
  Type: TType,
  typeName: TTypeName
) => Input.Type.merge(Type).extend({ type: z.literal(typeName) });

export class InputPlugin<
  TType extends z.ZodObject<z.ZodRawShape, any, any>,
  TTypeName extends string
> {
  declare treeClient: TTreeClient;
  declare MergedType: ReturnType<typeof mergeTypes<TType, TTypeName>>;
  SpecificType: TType;
  declare typeName: TTypeName;
  pluginType = "input" as const;

  constructor(treeClient: TTreeClient, Type: TType, typeName: TTypeName) {
    this.treeClient = treeClient;
    this.MergedType = mergeTypes(Type, typeName);
    this.SpecificType = Type;
    this.typeName = typeName;
  }

  create(
    data: Partial<Omit<z.infer<typeof this.SpecificType>, "type" | "id">>
  ): z.infer<typeof this.MergedType> {
    return this.treeClient.inputs.create({
      answers: [],
      ...data,
      type: this.typeName,
    }) as z.infer<typeof this.MergedType>;
  }

  isType(input: any): input is z.infer<typeof this.MergedType> {
    return this.MergedType.safeParse(input).success;
  }

  isRecordOfType(
    inputs: any
  ): inputs is z.infer<z.ZodRecord<z.ZodString, typeof this.MergedType>> {
    return z.record(this.MergedType).safeParse(inputs).success;
  }

  private returnOnlyWhenType = (x: any) => {
    if (!this.isType(x)) return undefined;
    return x;
  };

  private returnOnlyWhenRecordOfType = (x: any) => {
    if (!this.isRecordOfType(x)) return undefined;
    return x;
  };

  get(inputId: string) {
    return pipe(
      inputId,
      this.treeClient.inputs.get.single,
      this.returnOnlyWhenType
    );
  }

  getN(inputIds: string[]) {
    return pipe(
      inputIds,
      this.treeClient.inputs.get.collection,
      this.returnOnlyWhenRecordOfType
    );
  }
}
