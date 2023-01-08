export * from "./plugin";
import { DirectEdgePlugin, TDirectEdge } from "./plugin";
import { directEdgeResolver } from "./resolver";

const plugin = new DirectEdgePlugin();
export const DirectEdgePluginObject = {
  plugin,
  type: plugin.type,
  resolver: directEdgeResolver,
};

export { DirectEdgePlugin };
export type { TDirectEdge };
export { directEdgeResolver as resolver };
