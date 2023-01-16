import { ODError } from "@open-decision/type-classes";
import { z } from "zod";
import { TTreeClient, TReadOnlyTreeClient } from "../treeClient";
import {
  ZEntityPluginBase,
  IEntityPluginBase,
  EntityPlugin,
} from "./EntityPlugin";
import { TNodeId, ZNodeId } from "./NodePlugin";

export const ZEdgeId = z.custom<TEdgeId>(
  (value) => typeof value === "string" && value.includes("edges")
);

export const isEdgeId = (value: any): value is TEdgeId => {
  return ZEdgeId.safeParse(value).success;
};

export const ZEdgePlugin = ZEntityPluginBase.extend({
  id: ZEdgeId,
  source: ZNodeId,
  target: ZNodeId.optional(),
});

export type TEdgeId = `edges_${string}`;

export interface IEdgePlugin<TType extends string = string>
  extends IEntityPluginBase<TType> {
  id: TEdgeId;
  source: TNodeId;
  target?: TNodeId;
}

export abstract class EdgePlugin<
  TType extends IEdgePlugin = IEdgePlugin
> extends EntityPlugin<TType> {
  pluginType = "edges" as const;

  abstract create: (data: any) => (treeClient: TTreeClient) => TType | ODError;

  delete = (ids: TEdgeId[]) => (treeClient: TTreeClient) => {
    treeClient.edges.delete(ids);
  };

  getSingle =
    (edgeId: TType["id"]) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.edges.get.single<TType>(edgeId);
  getCollection =
    (edgeIds: TType["id"][]) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.edges.get.collection<TType>(edgeIds);

  getAll = (treeClient: TTreeClient | TReadOnlyTreeClient) =>
    treeClient.edges.get.allOfType<TType>(this.type);

  getByNode =
    (nodeId: TNodeId) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.edges.get.byNode<TType>(nodeId, this.type);

  subscribeSingle =
    (edgeId: TType["id"]) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.edges.get.single<TType>(edgeId);

  subscribeCollection =
    (edgeIds: TType["id"][]) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.edges.get.collection<TType>(edgeIds);

  subscribeAll = (treeClient: TTreeClient | TReadOnlyTreeClient) =>
    treeClient.edges.get.allOfType<TType>(this.type);

  subscribeByNode =
    (nodeId: TNodeId) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.edges.get.byNode<TType>(nodeId, this.type);
}
