import { Condition, TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";
import { pipe } from "remeda";
import { ODProgrammerError } from "@open-decision/type-classes";

const mergeTypes = <
  TType extends z.ZodObject<z.ZodRawShape, any, any>,
  TTypeName extends string
>(
  Type: TType,
  typeName: TTypeName
) => Condition.Type.merge(Type).extend({ type: z.literal(typeName) });

export class ConditionPlugin<
  TType extends z.ZodObject<z.ZodRawShape, any, any>,
  TTypeName extends string
> {
  declare treeClient: TTreeClient;
  declare MergedType: ReturnType<typeof mergeTypes<TType, TTypeName>>;
  SpecificType: TType;
  declare typeName: TTypeName;
  pluginType = "condition" as const;

  constructor(treeClient: TTreeClient, Type: TType, typeName: TTypeName) {
    this.treeClient = treeClient;
    this.MergedType = mergeTypes(Type, typeName);
    this.SpecificType = Type;
    this.typeName = typeName;
  }

  create(
    data?: Omit<Partial<z.infer<typeof this.MergedType>>, "type" | "id">
  ): z.infer<typeof this.MergedType> {
    const newCondition = this.treeClient.conditions.create({
      ...data,
      type: this.typeName,
    }) as z.infer<typeof this.MergedType>;

    const parsedCondition = this.MergedType.safeParse(newCondition);

    if (!parsedCondition.success)
      throw new ODProgrammerError({
        code: "INVALID_ENTITY_CREATION",
        message:
          "The condition could not be created. Please check that the data is correct.",
      });

    return parsedCondition.data;
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

  get(conditionId: string) {
    return pipe(
      conditionId,
      this.treeClient.conditions.get.single,
      this.returnOnlyWhenType
    );
  }

  getN(conditionIds: string[]) {
    return pipe(
      conditionIds,
      this.treeClient.conditions.get.collection,
      this.returnOnlyWhenRecordOfType
    );
  }
}
