import { z } from "zod";
import { FormCanvasNode } from "./FormCanvasNode";
import { FormNodePlugin } from "./formNodePlugin";
import { FormNodeSidebar } from "./FormNodeSidebar/FormNodeSidebar";
import { FormNodeRenderer } from "./FormNodeRenderer";
import { IdCardIcon } from "@radix-ui/react-icons";

export * from "./formNodePlugin";
const plugin = new FormNodePlugin();

export const FormNodePluginObject = {
  plugin,
  Editor: {
    Node: FormCanvasNode,
    Sidebar: FormNodeSidebar,
  },
  Renderer: FormNodeRenderer,
  type: plugin.typeName,
  pluginEntities: { inputs: z.record(plugin.inputType) },
  Icon: IdCardIcon,
};

export { formNodeInputType } from "./createInputPlugins";
