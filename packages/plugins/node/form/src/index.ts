import { z } from "zod";
import { FormCanvasNode } from "./FormCanvasNode";
import { FormNodePlugin } from "./FormNodePlugin";
import { FormNodeSidebar } from "./FormNodeSidebar/FormNodeSidebar";
import { FormNodeRenderer } from "./FormNodeRenderer";
import { IdCardIcon } from "@radix-ui/react-icons";
import { FormNodeInputType } from "./FormNodeInputs";

export * from "./FormNodePlugin";
const plugin = new FormNodePlugin();

export const FormNodePluginObject = {
  plugin,
  Editor: {
    Node: FormCanvasNode,
    Sidebar: FormNodeSidebar,
  },
  Renderer: FormNodeRenderer,
  type: plugin.type,
  pluginEntities: { inputs: z.record(FormNodeInputType) },
  Icon: IdCardIcon,
};
