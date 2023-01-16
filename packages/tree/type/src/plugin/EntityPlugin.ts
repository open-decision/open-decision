import { z } from "zod";
import { TReadOnlyTreeClient, TTreeClient } from "../treeClient";

export type TId<TEntity extends string = string> = `${TEntity}_${string}`;

export const ZEntityId = z.custom<TId>((value) => typeof value === "string");

export const ZEntityPluginBase = z.object({
  id: ZEntityId,
  type: z.string(),
});

export interface IEntityPluginBase<TType extends string = string> {
  id: TId;
  type: TType;
}

export abstract class EntityPlugin<
  TType extends IEntityPluginBase = IEntityPluginBase
> {
  type: TType["type"];
  declare abstract pluginType: "edges" | "nodes" | "pluginEntity";
  declare isAddable: boolean;

  constructor(typeName: TType["type"]) {
    this.type = typeName;
  }

  abstract delete: (ids: TType["id"][]) => (treeClient: TTreeClient) => void;

  abstract getSingle: (
    id: TType["id"]
  ) => (treeClient: TTreeClient | TReadOnlyTreeClient) => TType | undefined;

  abstract getCollection: (
    ids: TType["id"][]
  ) => (
    treeClient: TTreeClient | TReadOnlyTreeClient
  ) => Record<string, TType> | undefined;

  abstract getAll: (
    treeClient: TTreeClient | TReadOnlyTreeClient
  ) => Record<string, TType> | undefined;

  abstract subscribeSingle: (
    id: TType["id"]
  ) => (treeClient: TReadOnlyTreeClient) => TType | undefined;

  abstract subscribeCollection: (
    ids: TType["id"][]
  ) => (treeClient: TReadOnlyTreeClient) => Record<string, TType> | undefined;

  abstract subscribeAll: (
    treeClient: TTreeClient | TReadOnlyTreeClient
  ) => Record<string, TType> | undefined;
}
