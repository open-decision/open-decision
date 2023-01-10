import { CompareEdgePlugin, ICompareEdge } from "./plugin";
import { compareEdgeResolver } from "./resolver";

const plugin = new CompareEdgePlugin();
export const CompareEdgePluginObject = {
  plugin,
  type: plugin.type,
  resolver: compareEdgeResolver,
};

export { CompareEdgePlugin };
export type { ICompareEdge };
export { compareEdgeResolver as resolver };
