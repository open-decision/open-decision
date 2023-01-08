import { InfoCanvasNode } from "./InfoCanvasNode";
import { InfoNodePlugin } from "./infoNodePlugin";
import { InfoNodeSidebar } from "./Sidebar/InfoNodeSidebar";
import { InfoNodeRenderer } from "./InfoNodeRenderer";
import { InfoCircledIcon } from "@radix-ui/react-icons";

export * from "./infoNodePlugin";

const plugin = new InfoNodePlugin();
export const InfoNodePluginObject = {
  plugin,
  Editor: { Node: InfoCanvasNode, Sidebar: InfoNodeSidebar },
  Renderer: InfoNodeRenderer,
  type: plugin.type,
  Icon: InfoCircledIcon,
};
