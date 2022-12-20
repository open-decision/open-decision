import { z } from "zod";
import { FormCanvasNode } from "./FormCanvasNode";
import { FormNodePlugin } from "./formNodePlugin";
import { FormNodeSidebar } from "./FormNodeSidebar/FormNodeSidebar";
import { FormNodeRenderer } from "./FormNodeRenderer";

export * from "./formNodePlugin";

export const createFormNodePlugin = () => {
  const plugin = new FormNodePlugin();

  return {
    plugin,
    Editor: {
      Node: FormCanvasNode,
      Sidebar: FormNodeSidebar,
    },
    Renderer: FormNodeRenderer,
    type: plugin.typeName,
    pluginEntities: { inputs: z.record(plugin.inputType) },
  };
};

export { formNodeInputType } from "./createInputPlugins";
