import { z } from "zod";
import { DecisionCanvasNode } from "./DecisionCanvasNode";
import { DecisionNodePlugin } from "./decisionNodePlugin";
import { DecisionNodeSidebar } from "./DecisionNodeSidebar/DecisionNodeSidebar";
import { DecisionNodeRenderer } from "./DecisionNodeRenderer";
import { Pencil1Icon } from "@radix-ui/react-icons";

export * from "./decisionNodePlugin";
const plugin = new DecisionNodePlugin();

export const DecisionNodePluginObject = {
  plugin,
  Editor: {
    Node: DecisionCanvasNode,
    Sidebar: DecisionNodeSidebar,
  },
  Renderer: DecisionNodeRenderer,
  type: plugin.typeName,
  pluginEntities: { inputs: z.record(plugin.inputType) },
  Icon: Pencil1Icon,
};
