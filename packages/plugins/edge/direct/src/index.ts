export * from "./plugin";
import { DirectEdgePlugin } from "./plugin";
import { directEdgeResolver } from "./resolver";

const plugin = new DirectEdgePlugin();
export const DirectEdgePluginObject = {
  plugin,
  type: plugin.type,
  resolver: directEdgeResolver,
};

export { DirectEdgePlugin };
export { directEdgeResolver as resolver };
