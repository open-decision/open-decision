import { ZEdgeId, ZNodeId, TEdgeId, TNodeId } from "@open-decision/tree-id";
import { ODError } from "@open-decision/type-classes";
import { TTreeClient, TReadOnlyTreeClient } from "../treeClient";
import { ZEntityPluginBase, IEntityBase, EntityPlugin } from "./EntityPlugin";

export const ZEdgePlugin = ZEntityPluginBase.extend({
  id: ZEdgeId,
  source: ZNodeId,
  target: ZNodeId.optional(),
});

export interface IEdge<TType = any> extends IEntityBase<TType> {
  id: TEdgeId;
  source: TNodeId;
  target?: TNodeId;
}

export abstract class EdgePlugin<
  TType extends IEdge = IEdge
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
