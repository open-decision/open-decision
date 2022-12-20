import { DocumentCanvasNode } from "./DocumentCanvasNode";
import { DocumentNodeSidebar } from "./DocumentNodeSidebar";
import { DocumentNodePlugin } from "./documentNodePlugin";
import { DocumentNodeRenderer } from "./DocumentNodeRenderer";

export const createDocumentNodePlugin = () => {
  const plugin = new DocumentNodePlugin();

  return {
    plugin,
    Editor: {
      Node: DocumentCanvasNode,
      Sidebar: DocumentNodeSidebar,
    },
    Renderer: DocumentNodeRenderer,
    type: plugin.typeName,
  };
};
