import { CompareEdgePlugin, TCompareEdge } from "./plugin";
import { compareEdgeResolver } from "./resolver";

const plugin = new CompareEdgePlugin();
export const CompareEdgePluginObject = {
  plugin,
  type: plugin.typeName,
  resolver: compareEdgeResolver,
};

export { CompareEdgePlugin };
export type { TCompareEdge };
export { compareEdgeResolver as resolver };
