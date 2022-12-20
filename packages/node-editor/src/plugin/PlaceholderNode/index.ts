import { EdgePluginObject } from "@open-decision/plugins-edge-helpers";
import { RendererNodePluginObject } from "@open-decision/renderer";
import { PlaceholderCanvasNode } from "./PlaceholderCanvasNode";
import { createNodeSidebar } from "./PlaceholderNodeSidebar";
import { PlaceholderNodePlugin } from "./placholderNodePlugin";

export { PlaceholderNodePlugin } from "./placholderNodePlugin";
export type { TPlaceholderNode } from "./placholderNodePlugin";

export const createPlaceholderNodePlugin = (
  nodePlugins: Record<string, RendererNodePluginObject>,
  edgePlugins: Record<string, EdgePluginObject>
) => {
  const plugin = new PlaceholderNodePlugin();

  return {
    plugin,
    Editor: {
      Node: PlaceholderCanvasNode,
      Sidebar: createNodeSidebar(nodePlugins, edgePlugins),
    },
    Renderer: null,
    type: plugin.typeName,
  };
};
