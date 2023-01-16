import { ODError } from "@open-decision/type-classes";
import { TTreeClient, TReadOnlyTreeClient } from "../treeClient";
import { IEntityPluginBase, EntityPlugin } from "./EntityPlugin";

export interface IEdgePlugin<TType extends string = string>
  extends IEntityPluginBase<TType> {
  source: string;
  target?: string;
}

export abstract class EdgePlugin<
  TType extends IEdgePlugin = IEdgePlugin
> extends EntityPlugin<TType> {
  pluginType = "edges" as const;

  abstract create: (data: any) => (treeClient: TTreeClient) => TType | ODError;

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
