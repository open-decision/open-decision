import { ODError, ODProgrammerError } from "@open-decision/type-classes";
import { z } from "zod";
import { TTreeClient, TReadOnlyTreeClient } from "../treeClient";
import {
  ZEntityPluginBase,
  IEntityPluginBase,
  EntityPlugin,
} from "./EntityPlugin";
import { IVariablePlugin } from "./VariablePlugin";

export const ZNodeId = z.custom<TNodeId>(
  (value) => typeof value === "string" && value.includes("nodes")
);

export const isNodeId = (value: any): value is TNodeId => {
  return ZNodeId.safeParse(value).success;
};

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

export type TNodeId = `nodes_${string}`;

export interface INodePlugin<TType = any> extends IEntityPluginBase<TType> {
  id: TNodeId;
  position: { x: number; y: number };
  name: string;
  parent?: string;
  final?: true;
  rendererButtonLabel?: string;
  isAddable?: boolean;
}

export abstract class BaseNodePlugin<
  TType extends INodePlugin = INodePlugin
> extends EntityPlugin<TType> {
  pluginType = "nodes" as const;

  isAddable = true;

  abstract create: (data: any) => (treeClient: TTreeClient) => TType;

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
  TType extends INodePlugin = INodePlugin
> extends BaseNodePlugin<TType> {}

export abstract class NodePluginWithVariable<
  TType extends INodePlugin = INodePlugin,
  TVariableType extends IVariablePlugin = IVariablePlugin
> extends BaseNodePlugin<TType> {
  hasVariable = true;

  abstract createVariable: (
    nodeId: TNodeId,
    answer: any
  ) => (
    treeClient: TTreeClient | TReadOnlyTreeClient
  ) => TVariableType | ODError | ODProgrammerError | undefined;
}
