import { ODError, ODProgrammerError } from "@open-decision/type-classes";
import { z } from "zod";
import { TReadOnlyTreeClient, TTreeClient } from "../treeClient";

export const EntityPluginBaseType = <
  TType extends string,
  TDataType extends z.ZodType
>(
  type: TType,
  data: TDataType
) =>
  z.object({
    id: z.string().uuid(),
    type: z.literal(type),
    data: data,
  });

export type TEntityPluginBase<
  TType extends string = string,
  TData = any
> = z.infer<ReturnType<typeof EntityPluginBaseType<TType, z.ZodType<TData>>>>;

export type deleteEntityFn = (
  ids: string[]
) => (treeClient: TTreeClient) => void;

export abstract class EntityPlugin<
  TType extends TEntityPluginBase = TEntityPluginBase
> {
  type: TType["type"];
  declare defaultData: TType["data"];
  declare abstract pluginType: "edges" | "nodes" | "pluginEntity";
  declare Type: ReturnType<typeof EntityPluginBaseType>;

  constructor(
    typeName: TType["type"],
    Type: ReturnType<typeof EntityPluginBaseType>,
    defaultData: TType["data"] = {}
  ) {
    this.type = typeName;
    this.Type = Type;
    this.defaultData = defaultData;
  }

  parse = (data: any) => {
    const parsedData = this.Type.safeParse(data);

    if (!parsedData.success) {
      return new ODError({
        code: "VALIDATION_ERROR",
        message: `The data provided to the entity plugin is not of the correct Type.`,
        additionalData: { errors: parsedData.error },
      });
    }

    return parsedData.data;
  };

  abstract create: (
    data: any
  ) => (treeClient: TTreeClient) => TType | ODError | ODProgrammerError;
  abstract delete: deleteEntityFn;

  abstract getSingle: (
    id: string
  ) => (
    treeClient: TTreeClient | TReadOnlyTreeClient
  ) => TType | ODProgrammerError;

  abstract getCollection: (
    ids: string[]
  ) => (
    treeClient: TTreeClient | TReadOnlyTreeClient
  ) => Record<string, TType> | undefined;

  abstract getAll: (
    treeClient: TTreeClient | TReadOnlyTreeClient
  ) => Record<string, TType> | undefined;

  abstract subscribeSingle: (
    id: string
  ) => (treeClient: TReadOnlyTreeClient) => TType | ODProgrammerError;

  abstract subscribeCollection: (
    ids: string[]
  ) => (treeClient: TReadOnlyTreeClient) => Record<string, TType> | undefined;

  abstract subscribeAll: (
    treeClient: TTreeClient | TReadOnlyTreeClient
  ) => Record<string, TType> | undefined;
}

export type EntityPluginType<TType extends z.ZodType> = z.infer<TType>;
