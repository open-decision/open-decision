import { GroupNodePlugin, typeName } from "./GroupNodePlugin";
import { GroupNodeSidebar } from "./GroupNodeSidebar/GroupNodeSidebar";
import { GroupCanvasNode } from "./GroupCanvasNode";
import { GroupNodeRenderer } from "./GroupNodeRenderer";
import { GroupIcon } from "@radix-ui/react-icons";

export { GroupNodePlugin } from "./GroupNodePlugin";
export type { IGroupNode } from "./GroupNodePlugin";

export const GroupNodePluginObject = {
  plugin: GroupNodePlugin,
  Editor: {
    Node: GroupCanvasNode,
    Sidebar: GroupNodeSidebar,
  },
  Renderer: GroupNodeRenderer,
  type: typeName,
  Icon: GroupIcon,
};
