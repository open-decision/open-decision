import { z } from "zod";
import { NodePlugin } from "./NodePlugin";

export type NodePluginObject<
  TType extends z.ZodType = any,
  TTypeName extends string = any,
  TPluginEntities extends z.ZodRawShape = any
> = {
  plugin: NodePlugin<TType, TTypeName>;
  type: TTypeName;
  pluginEntities?: TPluginEntities;
};
