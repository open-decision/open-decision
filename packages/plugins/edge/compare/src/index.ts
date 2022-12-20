import { EdgePluginObject } from "@open-decision/plugins-edge-helpers";
import { CompareEdgePlugin, DataType, TCompareEdge } from "./plugin";
import { resolver } from "./resolver";

export const createCompareEdgePlugin = (): EdgePluginObject<
  typeof DataType,
  "compare",
  TCompareEdge
> => {
  const plugin = new CompareEdgePlugin();

  return {
    plugin,
    type: plugin.typeName,
    resolver,
  };
};

export { CompareEdgePlugin };
export type { TCompareEdge };
export { resolver };
