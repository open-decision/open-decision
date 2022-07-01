import { z } from "zod";
import { pipe } from "remeda";
import { TBaseTreeClient } from "../treeClient/createTreeClient";

const BaseType = z.object({
  id: z.string().uuid(),
});

// type createTypeConfig<
//   TTypeName extends string,
//   TType extends z.AnyZodObject
// > = {
//   typeName: TTypeName;
//   Type: TType;
// };

// export const createInputType = <
//   TTypeName extends string,
//   TType extends z.AnyZodObject
// >({
//   typeName,
//   Type,
// }: createTypeConfig<TTypeName, TType>) => {
//   const MergedType = BaseType.merge(Type).merge(
//     z.object({ type: z.literal(typeName) })
//   );

//   return {
//     pluginType: "input" as const,
//     typeName,
//     SpecificType: Type,
//     Type: MergedType,
//     validate: MergedType.safeParse,
//   };
// };

// export const createInputPlugin =
//   <
//     TTypeName extends string,
//     TType extends z.AnyZodObject,
//     TMethods extends Record<string, any>
//   >(
//     inputType: ReturnType<typeof createInputType<TTypeName, TType>>,
//     customMethods: (treeClient: TBaseTreeClient) => TMethods
//   ) =>
//   (treeClient: TBaseTreeClient) => {
//     return pipe(
//       inputType,
//       merge({
//         get: (inputId: string) =>
//           pipe(inputId, treeClient.inputs.get, inputType.Type.safeParse, (x) =>
//             x.success ? x.data : undefined
//           ),
//         getN: (inputIds: string[]) =>
//           pipe(
//             inputIds,
//             treeClient.inputs.getN,
//             z.record(inputType.Type).safeParse,
//             (x) => (x.success ? x.data : undefined)
//           ),
//         create: (data?: Partial<z.infer<typeof inputType["SpecificType"]>>) =>
//           treeClient.inputs.create({ ...data, type: inputType.typeName }),
//       }),
//       merge(customMethods?.(treeClient))
//     );
//   };

const mergeTypes = <
  TType extends z.ZodObject<z.ZodRawShape, any, any>,
  TTypeName extends string
>(
  Type: TType,
  typeName: TTypeName
) => BaseType.merge(Type).extend({ type: z.literal(typeName) });

export const Record = z.record(BaseType);

export type TBaseInput = z.infer<typeof BaseType>;
export type TInputsRecord = z.infer<typeof Record>;

export class InputPlugin<
  TType extends z.ZodObject<z.ZodRawShape, any, any>,
  TTypeName extends string
> {
  declare treeClient: TBaseTreeClient;
  declare MergedType: ReturnType<typeof mergeTypes<TType, TTypeName>>;
  SpecificType: TType;
  declare typeName: string;
  pluginType = "input" as const;

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

  get(inputId: string) {
    return pipe(inputId, this.treeClient.inputs.get, this.returnOnlyWhenType);
  }

  getN(inputIds: string[]) {
    return pipe(
      inputIds,
      this.treeClient.inputs.getN,
      this.returnOnlyWhenRecordOfType
    );
  }

  //FIXME Return type is not proper
  create(
    data?: Omit<z.infer<typeof this.SpecificType>, "type">
  ): z.infer<typeof this.MergedType> {
    return this.treeClient.inputs.create({
      answers: [],
      ...data,
      type: this.typeName,
    }) as z.infer<typeof this.MergedType>;
  }
}
