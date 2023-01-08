import { ComponentPlaceholderIcon } from "@radix-ui/react-icons";
import { PlaceholderCanvasNode } from "./PlaceholderCanvasNode";
import { PlaceholderNodeSidebar } from "./PlaceholderNodeSidebar";
import { PlaceholderNodePlugin } from "./placholderNodePlugin";

export { PlaceholderNodePlugin } from "./placholderNodePlugin";
export type { TPlaceholderNode } from "./placholderNodePlugin";

const plugin = new PlaceholderNodePlugin();

export const PlaceholderNodePluginObject = {
  plugin,
  Editor: {
    Node: PlaceholderCanvasNode,
    Sidebar: PlaceholderNodeSidebar,
  },
  Renderer: null,
  type: plugin.type,
  Icon: ComponentPlaceholderIcon,
};
