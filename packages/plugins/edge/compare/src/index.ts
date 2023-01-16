import { createEdgePluginObject } from "@open-decision/plugins-edge-helpers";
import { ZEdgePlugin } from "@open-decision/tree-type";
import { z } from "zod";
import { CompareEdgePlugin, ICompareEdge } from "./plugin";
import { compareEdgeResolver } from "./resolver";

const ZCompareEdge = ZEdgePlugin.extend({
  condition: z.object({
    variableId: z.string(),
    valueIds: z.array(z.string()),
  }),
  type: z.literal("compare"),
});

const plugin = new CompareEdgePlugin();

export const CompareEdgePluginObject = createEdgePluginObject({
  plugin,
  type: plugin.type,
  resolver: compareEdgeResolver,
  Type: ZCompareEdge,
});

export { CompareEdgePlugin };
export type { ICompareEdge as ICompareEdge };
export { compareEdgeResolver as resolver };
