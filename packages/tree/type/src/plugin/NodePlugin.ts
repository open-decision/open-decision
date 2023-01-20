import { TNodeId, ZNodeId } from "@open-decision/tree-ids";
import { ODError, ODProgrammerError } from "@open-decision/type-classes";
import { IVariable } from "@open-decision/variables";
import { z } from "zod";
import { TTreeClient, TReadOnlyTreeClient } from "../treeClient";
import { ZEntityPluginBase, IEntityBase, EntityPlugin } from "./EntityPlugin";

export type createFn<TType extends INode> = (
  data?: Partial<Omit<TType, "id" | "type">> & Partial<{ [x: string]: any }>
) => (treeClient: TTreeClient) => TType;

export const ZNodePlugin = ZEntityPluginBase.extend({
  id: ZNodeId,
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  name: z.string().optional(),
  parent: z.string().optional(),
  final: z.boolean().optional(),
  rendererButtonLabel: z.string().optional(),
  isAddable: z.boolean().optional(),
});

export interface INode<TType = any> extends IEntityBase<TType> {
  id: TNodeId;
  position: { x: number; y: number };
  name: string;
  parent?: string;
  final?: true;
  rendererButtonLabel?: string;
  isAddable?: boolean;
}

export abstract class BaseNodePlugin<
  TType extends INode = INode
> extends EntityPlugin<TType> {
  pluginType = "nodes" as const;

  isAddable = true;

  abstract create: createFn<TType>;

  getSingle =
    (nodeId: TType["id"]) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.nodes.get.single<TType>(nodeId, this.type);

  getCollection =
    (nodeIds: TType["id"][]) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.nodes.get.collection<TType>(nodeIds, this.type);

  getAll = (treeClient: TTreeClient | TReadOnlyTreeClient) =>
    treeClient.nodes.get.allOfType<TType>(this.type);

  subscribeSingle =
    (nodeId: TType["id"]) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.nodes.get.single<TType>(nodeId, this.type);

  subscribeCollection =
    (nodeIds: TType["id"][]) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.nodes.get.collection<TType>(nodeIds, this.type);

  subscribeAll = (treeClient: TTreeClient | TReadOnlyTreeClient) =>
    treeClient.nodes.get.allOfType<TType>(this.type);

  delete = (nodeIds: TNodeId[]) => (treeClient: TTreeClient) => {
    treeClient.nodes.delete(nodeIds);
  };
}

export abstract class NodePlugin<
  TType extends INode = INode
> extends BaseNodePlugin<TType> {}

export abstract class NodePluginWithVariable<
  TType extends INode = INode,
  TVariableType extends IVariable = IVariable
> extends BaseNodePlugin<TType> {
  hasVariable = true;

  abstract createVariable: (
    nodeId: TNodeId,
    answer: any
  ) => (
    treeClient: TTreeClient | TReadOnlyTreeClient
  ) => TVariableType | ODError | ODProgrammerError | undefined;
}
