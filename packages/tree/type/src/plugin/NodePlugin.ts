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

abstract class BaseNodePlugin<
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

  createReadableKey = (key: string) =>
    key
      .split(" ")
      .join("_")
      .replace(/\u00df/g, "ss")
      .replace(/\u00e4/g, "ae")
      .replace(/\u00f6/g, "oe")
      .replace(/\u00fc/g, "ue")
      .replace(/\u00c4/g, "Ae")
      .replace(/\u00d6/g, "Oe")
      .replace(/\u00dc/g, "Ue")
      .replace(/\W/g, "");
}

export abstract class NodePlugin<
  TType extends INodePlugin = INodePlugin
> extends BaseNodePlugin<TType> {}

export abstract class NodePluginWithVariable<
  TType extends INodePlugin = INodePlugin,
  TVariableType extends IVariablePlugin = IVariablePlugin
> extends BaseNodePlugin<TType> {
  hasVariable = true;

  abstract getVariable: (
    nodeId: string,
    answers: any
  ) => TVariableType | undefined;

  abstract createVariable: (
    nodeId: string,
    answer: any
  ) => (
    treeClient: TTreeClient | TReadOnlyTreeClient
  ) => TVariableType | ODError | ODProgrammerError | undefined;

  abstract createReadableVariable: (
    nodeId: string,
    answer: any
  ) => (
    treeClient: TTreeClient | TReadOnlyTreeClient
  ) => TVariableType | ODError | ODProgrammerError | undefined;
}
