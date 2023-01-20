import { ZEntityId, TId } from "@open-decision/tree-id";
import { z } from "zod";
import { TReadOnlyTreeClient, TTreeClient } from "../treeClient";

export const ZEntityPluginBase = z.object({
  id: ZEntityId,
});

export interface IEntityBase<TType = any> {
  id: TId;
  type: TType;
}

export abstract class EntityPlugin<TType extends IEntityBase = IEntityBase> {
  type: TType["type"];
  abstract pluginType: "edges" | "nodes" | "pluginEntity";

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
