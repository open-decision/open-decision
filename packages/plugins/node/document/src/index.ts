import { DocumentCanvasNode } from "./DocumentCanvasNode";
import { DocumentNodeSidebar } from "./DocumentNodeSidebar/DocumentNodeSidebar";
import { DocumentNodePlugin } from "./DocumentNodePlugin";
import { DocumentNodeRenderer } from "./DocumentNodeRenderer";
import { FileTextIcon } from "@radix-ui/react-icons";
import { ZNodePlugin } from "@open-decision/tree-type";
import { z } from "zod";
import { RichText } from "@open-decision/rich-text-editor";
import { createNodePluginObject } from "@open-decision/plugins-node-helpers";

const plugin = new DocumentNodePlugin();

const ZDocumentNode = ZNodePlugin.extend({
  type: z.literal(plugin.type),
  content: RichText.optional(),
  templateUuid: z.string().optional(),
});

export const DocumentNodePluginObject = createNodePluginObject({
  plugin,
  Editor: {
    Node: DocumentCanvasNode,
    Sidebar: DocumentNodeSidebar,
  },
  Renderer: DocumentNodeRenderer,
  type: plugin.type,
  Icon: FileTextIcon,
  Type: ZDocumentNode,
});
