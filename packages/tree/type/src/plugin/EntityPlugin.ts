import { ODError, ODProgrammerError } from "@open-decision/type-classes";
import { z } from "zod";
import { TReadOnlyTreeClient, TTreeClient } from "../treeClient";

export interface IEntityPluginBase<TType extends string = string, TData = any> {
  type: TType;
  data: TData;
  id: string;
}

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

export type deleteEntityFn = (
  ids: string[]
) => (treeClient: TTreeClient) => void;

export abstract class EntityPlugin<
  TType extends IEntityPluginBase = IEntityPluginBase
> {
  type: TType["type"];
  declare defaultData: TType["data"];
  declare abstract pluginType: "edges" | "nodes" | "pluginEntity";
  declare Type: z.ZodType<TType>;

  constructor(
    typeName: TType["type"],
    Type: z.ZodType<TType>,
    defaultData: TType["data"] = {}
  ) {
    this.type = typeName;
    this.Type = Type;
    this.defaultData = defaultData;
  }

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
