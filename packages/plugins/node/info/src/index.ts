import { InfoCanvasNode } from "./InfoCanvasNode";
import { InfoNodePlugin } from "./InfoNodePlugin";
import { InfoNodeSidebar } from "./Sidebar/InfoNodeSidebar";
import { InfoNodeRenderer } from "./InfoNodeRenderer";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { ZNodePlugin } from "@open-decision/tree-type";
import { z } from "zod";
import { RichText } from "@open-decision/rich-text-editor";
import { createNodePluginObject } from "@open-decision/plugins-node-helpers";

export * from "./InfoNodePlugin";

const plugin = new InfoNodePlugin();
const ZInfoNode = ZNodePlugin.extend({
  type: z.literal(plugin.type),
  content: RichText.optional(),
});

export const InfoNodePluginObject = createNodePluginObject({
  plugin,
  Editor: { Node: InfoCanvasNode, Sidebar: InfoNodeSidebar },
  Renderer: InfoNodeRenderer,
  type: plugin.type,
  Icon: InfoCircledIcon,
  Type: ZInfoNode,
});
