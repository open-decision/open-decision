import { z } from "zod";
import { TBaseTreeClient } from "../treeClient/createTreeClient";
import { pipe } from "remeda";

export const BaseType = z.object({
  id: z.string().uuid(),
  inputId: z.string().uuid().optional(),
});

const mergeTypes = <
  TType extends z.ZodObject<z.ZodRawShape, any, any>,
  TTypeName extends string
>(
  Type: TType,
  typeName: TTypeName
) => BaseType.merge(Type).extend({ type: z.literal(typeName) });

export class ConditionPlugin<
  TType extends z.ZodObject<z.ZodRawShape, any, any>,
  TTypeName extends string
> {
  declare treeClient: TBaseTreeClient;
  declare MergedType: ReturnType<typeof mergeTypes<TType, TTypeName>>;
  SpecificType: TType;
  declare typeName: string;
  pluginType = "condition" as const;

  constructor(treeClient: TBaseTreeClient, Type: TType, typeName: TTypeName) {
    this.treeClient = treeClient;
    this.MergedType = mergeTypes(Type, typeName);
    this.SpecificType = Type;
    this.typeName = typeName;
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
      this.treeClient.conditions.get,
      this.returnOnlyWhenType
    );
  }

  getN(conditionIds: string[]) {
    return pipe(
      conditionIds,
      this.treeClient.conditions.getN,
      this.returnOnlyWhenRecordOfType
    );
  }

  //FIXME Returntype is not proper
  create(
    data?: Partial<z.infer<typeof this.SpecificType>>
  ): z.infer<typeof this.MergedType> {
    return this.treeClient.conditions.create({
      ...data,
      type: this.typeName,
    }) as z.infer<typeof this.MergedType>;
  }
}

// type createTypeConfig<
//   TTypeName extends string,
//   TType extends z.AnyZodObject,
//   TMethods extends Record<string, any>
// > = {
//   typeName: TTypeName;
//   Type: TType;
//   customMethods?: (treeClient: TBaseTreeClient) => TMethods;
// };

// export const createConditionType =
//   <
//     TTypeName extends string,
//     TType extends z.AnyZodObject,
//     TMethods extends Record<string, any>
//     // TInput extends z.infer<TType> & TBaseInput
//   >({
//     typeName,
//     Type,
//     customMethods,
//   }: createTypeConfig<TTypeName, TType, TMethods>) =>
//   (treeClient: TBaseTreeClient) => {
//     const MergedType = BaseType.merge(Type).merge(
//       z.object({ type: z.literal(typeName) })
//     );

//     return merge(
//       {
//         pluginType: "condition" as const,
//         typeName,
//         validate: MergedType.safeParse,
//         get: (inputId: string) =>
//           pipe(inputId, treeClient.conditions.get, MergedType.safeParse, (x) =>
//             x.success ? x.data : undefined
//           ),
//         getN: (inputIds: string[]) =>
//           pipe(
//             inputIds,
//             treeClient.conditions.getN,
//             z.record(MergedType).safeParse,
//             (x) => (x.success ? x.data : undefined)
//           ),
//         getAll: () =>
//           pipe(
//             treeClient.conditions.getAll(),
//             z.record(MergedType).safeParse,
//             (x) => (x.success ? x.data : undefined)
//           ),
//         create: (data: Partial<z.infer<TType>>) =>
//           treeClient.conditions.create({ ...data, type: typeName }),
//       },
//       customMethods?.(treeClient)
//     );
//   };

export const Record = z.record(BaseType);

export type TCondition = z.infer<typeof BaseType>;
export type TRecord = z.infer<typeof Record>;
