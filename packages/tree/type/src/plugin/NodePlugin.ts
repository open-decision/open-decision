import { TTreeClient, TReadOnlyTreeClient } from "../treeClient";
import {
  IEntityPluginBase,
  EntityPlugin,
  deleteEntityFn,
  EntityPluginBaseType,
} from "./EntityPlugin";
import { z } from "zod";

export interface INodePlugin<TType extends string = string, TDataType = any>
  extends IEntityPluginBase<TType, TDataType> {
  position: { x: number; y: number };
  name?: string;
  parent?: string;
  final?: true;
  rendererButtonLabel?: string;
  isAddable?: true;
}

export const NodePluginBaseType = <
  TType extends string,
  TDataType extends z.ZodType
>(
  type: TType,
  data: TDataType
) =>
  EntityPluginBaseType(type, data).extend({
    position: z.object({ x: z.number(), y: z.number() }),
    name: z.string().optional(),
    parent: z.string().optional(),
    final: z.literal(true).optional(),
    isAddable: z.literal(true).optional(),
    rendererButtonLabel: z.string().optional(),
  });

export abstract class NodePlugin<
  TType extends INodePlugin = INodePlugin
> extends EntityPlugin<TType> {
  pluginType = "nodes" as const;
  isAddable: boolean;

  constructor(
    type: TType["type"],
    Type: z.ZodType<TType>,
    defaultData: TType["data"] = {},
    config: { isAddable: boolean } = { isAddable: true }
  ) {
    super(type, Type, defaultData);

    this.isAddable = config?.isAddable;
  }

  create =
    (
      data: Omit<TType, "id" | "type" | "data"> & {
        data?: Partial<TType["data"]>;
      }
    ) =>
    (_treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return {
        id: crypto.randomUUID(),
        type: this.type,
        ...data,
        data: { ...this.defaultData, ...data.data },
      } as TType;
    };

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
