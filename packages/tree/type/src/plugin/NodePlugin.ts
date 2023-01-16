import { ODError, ODProgrammerError } from "@open-decision/type-classes";
import { TTreeClient, TReadOnlyTreeClient } from "../treeClient";
import {
  IEntityPluginBase,
  EntityPlugin,
  deleteEntityFn,
} from "./EntityPlugin";
import { IVariablePlugin } from "./VariablePlugin";

export interface INodePlugin<TType extends string = string>
  extends IEntityPluginBase<TType> {
  position: { x: number; y: number };
  name?: string;
  parent?: string;
  final?: true;
  rendererButtonLabel?: string;
  isAddable?: true;
}

export interface NodePluginWithVariable<TVariableType extends IVariablePlugin> {
  getVariable: (nodeId: string, answers: any) => TVariableType | undefined;

  createVariable: (
    nodeId: string,
    answer: any
  ) => (
    treeClient: TTreeClient | TReadOnlyTreeClient
  ) => TVariableType | ODError | ODProgrammerError | undefined;
}

export abstract class NodePlugin<
  TType extends INodePlugin = INodePlugin
> extends EntityPlugin<TType> {
  pluginType = "nodes" as const;

  abstract create: (data: any) => (treeClient: TTreeClient) => TType;

  getSingle =
    (nodeId: string) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.nodes.get.single<TType>(nodeId);

  getCollection =
    (nodeIds: string[]) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.nodes.get.collection<TType>(nodeIds);

  getAll = (treeClient: TTreeClient | TReadOnlyTreeClient) =>
    treeClient.nodes.get.all<TType>();

  subscribeSingle =
    (nodeId: string) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.nodes.get.single<TType>(nodeId);

  subscribeCollection =
    (nodeIds: string[]) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.nodes.get.collection<TType>(nodeIds);

  subscribeAll = (treeClient: TTreeClient | TReadOnlyTreeClient) =>
    treeClient.nodes.get.all<TType>();

  delete: deleteEntityFn = (nodeIds) => (treeClient) => {
    treeClient.nodes.delete(nodeIds);
  };
}
