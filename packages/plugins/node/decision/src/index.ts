import { DecisionCanvasNode } from "./DecisionCanvasNode";
import { DecisionNodePlugin } from "./DecisionNodePlugin";
import { DecisionNodeSidebar } from "./DecisionNodeSidebar/DecisionNodeSidebar";
import { DecisionNodeRenderer } from "./DecisionNodeRenderer";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { createNodePluginObject } from "@open-decision/plugins-node-helpers";

export * from "./DecisionNodePlugin";

const plugin = new DecisionNodePlugin();

export const DecisionNodePluginObject = createNodePluginObject({
  plugin,
  Editor: {
    Node: DecisionCanvasNode,
    Sidebar: DecisionNodeSidebar,
  },
  Renderer: DecisionNodeRenderer,
  type: plugin.type,
  pluginEntities: ["inputs"],
  Icon: Pencil1Icon,
});
