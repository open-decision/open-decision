import { InfoCanvasNode } from "./InfoCanvasNode";
import { InfoNodePlugin } from "./infoNodePlugin";
import { InfoNodeSidebar } from "./Sidebar/InfoNodeSidebar";
import { InfoNodeRenderer } from "./InfoNodeRenderer";

export * from "./infoNodePlugin";

export const createInfoNodePlugin = () => {
  const plugin = new InfoNodePlugin();

  return {
    plugin,
    Editor: { Node: InfoCanvasNode, Sidebar: InfoNodeSidebar },
    Renderer: InfoNodeRenderer,
    type: plugin.typeName,
  };
};
