import { ODError } from "@open-decision/type-classes";
import { TTreeClient, TReadOnlyTreeClient } from "../treeClient";
import {
  TEntityPluginBase,
  EntityPlugin,
  EntityPluginBaseType,
} from "./EntityPlugin";
import { z } from "zod";

export const EdgePluginBaseType = <
  TType extends string,
  TDataType extends z.ZodType
>(
  type: TType,
  data: TDataType
) =>
  EntityPluginBaseType(type, data).extend({
    source: z.string(),
    target: z.string().optional(),
  });

export type TEdgePlugin<
  TType extends string = string,
  TData = any
> = TEntityPluginBase<TType, TData> & {
  source: string;
  target?: string;
};

export abstract class EdgePlugin<
  TType extends TEdgePlugin = TEdgePlugin
> extends EntityPlugin<TType> {
  pluginType = "edges" as const;

  create =
    (
      data: Omit<TType, "id" | "type" | "data"> & {
        data?: Partial<TType["data"]>;
      }
    ) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const newEdge = treeClient.edges.create({
        type: this.type,
        ...data,
        data: { ...this.defaultData, ...data.data },
      });

      if (newEdge instanceof ODError) {
        return newEdge;
      }

      return newEdge as TType;
    };

  delete = (ids: string[]) => (treeClient: TTreeClient) => {
    treeClient.edges.delete(ids);
  };

  getSingle =
    (edgeId: string) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.edges.get.single<TType>(edgeId);
  getCollection =
    (edgeIds: string[]) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.edges.get.collection<TType>(edgeIds);

  getAll = (treeClient: TTreeClient | TReadOnlyTreeClient) =>
    treeClient.edges.get.all<TType>();

  getByNode =
    (nodeId: string) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.edges.get.byNode<TType>(nodeId, this.type);

  subscribeSingle =
    (edgeId: string) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.edges.get.single<TType>(edgeId);
  subscribeCollection =
    (edgeIds: string[]) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.edges.get.collection<TType>(edgeIds);

  subscribeAll = (treeClient: TTreeClient | TReadOnlyTreeClient) =>
    treeClient.edges.get.all<TType>();

  subscribeByNode =
    (nodeId: string) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.edges.get.byNode<TType>(nodeId, this.type);
}
