import { TTreeClient, TReadOnlyTreeClient } from "../treeClient";
import {
  TEntityPluginBase,
  EntityPlugin,
  deleteEntityFn,
  EntityPluginBaseType,
} from "./EntityPlugin";
import { z } from "zod";

export type TNodePlugin<
  TType extends string = string,
  TDataType = any
> = TEntityPluginBase<TType, TDataType> & {
  position: { x: number; y: number };
  name?: string;
  parent?: string;
  final?: true;
  rendererButtonLabel?: string;
  isAddable?: true;
};

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
  TType extends TNodePlugin = TNodePlugin
> extends EntityPlugin<TType> {
  pluginType = "nodes" as const;

  create =
    (
      data: Omit<TType, "id" | "type" | "data" | "position"> & {
        data?: Partial<TType["data"]>;
        position?: TType["position"];
      }
    ) =>
    (_treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return {
        id: crypto.randomUUID(),
        type: this.type,
        position: { x: 0, y: 0 },
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
