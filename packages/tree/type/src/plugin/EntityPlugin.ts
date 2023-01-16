import { ODProgrammerError } from "@open-decision/type-classes";
import { TReadOnlyTreeClient, TTreeClient } from "../treeClient";

export interface IEntityPluginBase<TType extends string = string> {
  id: string;
  type: TType;
}

export type deleteEntityFn = (
  ids: string[]
) => (treeClient: TTreeClient) => void;

export abstract class EntityPlugin<
  TType extends IEntityPluginBase = IEntityPluginBase
> {
  type: TType["type"];
  declare abstract pluginType: "edges" | "nodes" | "pluginEntity";
  declare isAddable: boolean;

  constructor(typeName: TType["type"]) {
    this.type = typeName;
  }

  abstract delete: deleteEntityFn;

  abstract getSingle: (
    id: string
  ) => (
    treeClient: TTreeClient | TReadOnlyTreeClient
  ) =>
    | TType
    | ODProgrammerError<"ENTITY_NOT_FOUND">
    | ODProgrammerError<"ENTITY_FOUND_ON_DIFFERENT_ENTITY_KEY">;

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
  ) => (
    treeClient: TReadOnlyTreeClient
  ) =>
    | TType
    | ODProgrammerError<"ENTITY_NOT_FOUND">
    | ODProgrammerError<"ENTITY_FOUND_ON_DIFFERENT_ENTITY_KEY">;

  abstract subscribeCollection: (
    ids: string[]
  ) => (treeClient: TReadOnlyTreeClient) => Record<string, TType> | undefined;

  abstract subscribeAll: (
    treeClient: TTreeClient | TReadOnlyTreeClient
  ) => Record<string, TType> | undefined;
}
