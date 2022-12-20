export * from "./plugin";
import { EdgePluginObject } from "@open-decision/plugins-edge-helpers";
import { DataType, DirectEdgePlugin, TDirectEdge } from "./plugin";
import { resolver } from "./resolver";

export const createDirectEdgePlugin = (): EdgePluginObject<
  typeof DataType,
  "direct",
  TDirectEdge
> => {
  const plugin = new DirectEdgePlugin();

  return {
    plugin,
    type: plugin.typeName,
    resolver,
  };
};
