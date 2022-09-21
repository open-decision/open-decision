import { Input, TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";
import { pipe } from "remeda";
import { ODProgrammerError } from "@open-decision/type-classes";

const mergeTypes = <TType extends z.ZodType, TTypeName extends string>(
  Type: TType,
  typeName: TTypeName
) =>
  Input.Type.merge(z.object({ data: Type })).extend({
    type: z.literal(typeName),
  });

export class InputPlugin<TType extends z.ZodType, TTypeName extends string> {
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

  create(data: Partial<z.infer<TType>>) {
    const newInput = this.treeClient.inputs.create({
      data,
      type: this.typeName,
    });

    const parsedInput = this.MergedType.safeParse(newInput);

    if (!parsedInput.success) {
      throw new ODProgrammerError({
        code: "INVALID_ENTITY_CREATION",
        message:
          "The input could not be created. Please check that the data is correct.",
      });
    }

    return parsedInput.data;
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
