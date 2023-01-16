export * from "./plugin";
import { createEdgePluginObject } from "@open-decision/plugins-edge-helpers";
import { ZEdgePlugin } from "@open-decision/tree-type";
import { z } from "zod";
import { DirectEdgePlugin } from "./plugin";
import { directEdgeResolver } from "./resolver";

const ZDirectEdge = ZEdgePlugin.extend({ type: z.literal("direct") });

const plugin = new DirectEdgePlugin();

export const DirectEdgePluginObject = createEdgePluginObject({
  plugin,
  type: plugin.type,
  resolver: directEdgeResolver,
  Type: ZDirectEdge,
});

export { DirectEdgePlugin };
export { directEdgeResolver as resolver };
