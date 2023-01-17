import { ZNodePlugin } from "@open-decision/tree-type";
import { ComponentPlaceholderIcon } from "@radix-ui/react-icons";
import { z } from "zod";
import { PlaceholderCanvasNode } from "./PlaceholderCanvasNode";
import { PlaceholderNodeSidebar } from "./PlaceholderNodeSidebar";
import { PlaceholderNodePlugin } from "./placholderNodePlugin";

export { PlaceholderNodePlugin } from "./placholderNodePlugin";
export type { IPlaceholderNode } from "./placholderNodePlugin";

const plugin = new PlaceholderNodePlugin();

const ZPlaceholderNode = ZNodePlugin.extend({
  type: z.literal(plugin.type),
});

export const PlaceholderNodePluginObject = {
  plugin,
  Editor: {
    Node: PlaceholderCanvasNode,
    Sidebar: PlaceholderNodeSidebar,
  },
  Renderer: null,
  type: plugin.type,
  Icon: ComponentPlaceholderIcon,
  Type: ZPlaceholderNode,
};
