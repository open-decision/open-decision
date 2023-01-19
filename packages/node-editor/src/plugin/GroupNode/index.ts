import { GroupNodePlugin, typeName } from "./GroupNodePlugin";
import { GroupNodeSidebar } from "./GroupNodeSidebar/GroupNodeSidebar";
import { GroupCanvasNode } from "./GroupCanvasNode";
import { GroupNodeRenderer } from "./GroupNodeRenderer/GroupNodeRenderer";
import { GroupIcon } from "@radix-ui/react-icons";
import { createNodePluginObject } from "@open-decision/plugins-node-helpers";
import { Tree, ZNodePlugin } from "@open-decision/tree-type";
import { z } from "zod";
import { RichText } from "@open-decision/rich-text-editor";

export { GroupNodePlugin } from "./GroupNodePlugin";
export type { IGroupNode } from "./GroupNodePlugin";

const plugin = new GroupNodePlugin();
const ZGroupNode = ZNodePlugin.extend({
  type: z.literal(plugin.type),
  content: RichText.optional(),
  cta: z.string().optional(),
  title: z.string().optional(),
  tree: Tree.Type,
});

export const GroupNodePluginObject = createNodePluginObject({
  plugin,
  Editor: {
    Node: GroupCanvasNode,
    Sidebar: GroupNodeSidebar,
  },
  Renderer: GroupNodeRenderer,
  type: typeName,
  Icon: GroupIcon,
  Type: ZGroupNode,
});
