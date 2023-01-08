import { DocumentCanvasNode } from "./DocumentCanvasNode";
import { DocumentNodeSidebar } from "./DocumentNodeSidebar/DocumentNodeSidebar";
import { DocumentNodePlugin } from "./documentNodePlugin";
import { DocumentNodeRenderer } from "./DocumentNodeRenderer";
import { FileTextIcon } from "@radix-ui/react-icons";

const plugin = new DocumentNodePlugin();
export const DocumentNodePluginObject = {
  plugin,
  Editor: {
    Node: DocumentCanvasNode,
    Sidebar: DocumentNodeSidebar,
  },
  Renderer: DocumentNodeRenderer,
  type: plugin.type,
  Icon: FileTextIcon,
};
