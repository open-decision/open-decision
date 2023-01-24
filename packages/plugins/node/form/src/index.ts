import { FormCanvasNode } from "./FormCanvasNode";
import { FormNodePlugin } from "./FormNodePlugin";
import { FormNodeSidebar } from "./FormNodeSidebar/FormNodeSidebar";
import { FormNodeRenderer } from "./FormNodeRenderer";
import { IdCardIcon } from "@radix-ui/react-icons";
import { createNodePluginObject } from "@open-decision/plugins-node-helpers";
import { ZNodePlugin } from "@open-decision/tree-type";
import { z } from "zod";
import { RichText } from "@open-decision/rich-text-editor";
import { formNodeInputPlugins } from "./FormNodeInputs";
import { ZInputId } from "@open-decision/tree-id";

export * from "./FormNodePlugin";

const plugin = new FormNodePlugin();

const ZFormNode = ZNodePlugin.extend({
  type: z.literal(plugin.type),
  content: RichText.optional(),
  inputs: z.array(ZInputId).optional(),
});

export const FormNodePluginObject = createNodePluginObject({
  plugin,
  Editor: {
    Node: FormCanvasNode,
    Sidebar: FormNodeSidebar,
  },
  Renderer: FormNodeRenderer,
  type: plugin.type,
  pluginEntities: { inputs: z.record(formNodeInputPlugins.Type) },
  Icon: IdCardIcon,
  Type: ZFormNode,
});
