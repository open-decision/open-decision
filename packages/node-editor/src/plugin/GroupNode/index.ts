import { GroupNodePlugin } from "./groupNodePlugin";
import { GroupNodeSidebar } from "./GroupNodeSidebar/GroupNodeSidebar";
import { GroupCanvasNode } from "./GroupCanvasNode";
import { RendererNodePluginObject } from "@open-decision/renderer";
import { createGroupNodeRenderer } from "./GroupNodeRenderer";
import { EdgePluginObject } from "@open-decision/plugins-edge-helpers";

export { GroupNodePlugin } from "./groupNodePlugin";
export type { TGroupNode } from "./groupNodePlugin";

export const createGroupNodePlugin = (
  edgePlugins: Record<string, EdgePluginObject>,
  nodePlugins: Record<string, RendererNodePluginObject>
) => {
  const plugin = new GroupNodePlugin();

  return {
    plugin,
    Editor: {
      Node: GroupCanvasNode,
      Sidebar: GroupNodeSidebar,
    },
    Renderer: createGroupNodeRenderer(edgePlugins, nodePlugins),
    type: plugin.typeName,
  };
};
