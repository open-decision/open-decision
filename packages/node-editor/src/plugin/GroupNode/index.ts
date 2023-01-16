import { GroupNodePlugin } from "./GroupNodePlugin";
import { GroupNodeSidebar } from "./GroupNodeSidebar/GroupNodeSidebar";
import { GroupCanvasNode } from "./GroupCanvasNode";
import { GroupNodeRenderer } from "./GroupNodeRenderer";
import { GroupIcon } from "@radix-ui/react-icons";

export { GroupNodePlugin } from "./GroupNodePlugin";
export type { IGroupNode as IGroupNode } from "./GroupNodePlugin";

const plugin = new GroupNodePlugin();

export const GroupNodePluginObject = {
  plugin,
  Editor: {
    Node: GroupCanvasNode,
    Sidebar: GroupNodeSidebar,
  },
  Renderer: GroupNodeRenderer,
  type: plugin.type,
  Icon: GroupIcon,
};
