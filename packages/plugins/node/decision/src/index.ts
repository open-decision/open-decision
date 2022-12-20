import { z } from "zod";
import { DecisionCanvasNode } from "./DecisionCanvasNode";
import { DecisionNodePlugin } from "./decisionNodePlugin";
import { DecisionNodeSidebar } from "./DecisionNodeSidebar/DecisionNodeSidebar";
import { DecisionNodeRenderer } from "./DecisionNodeRenderer";

export * from "./decisionNodePlugin";

export const createDecisionNodePlugin = () => {
  const plugin = new DecisionNodePlugin();

  return {
    plugin,
    Editor: {
      Node: DecisionCanvasNode,
      Sidebar: DecisionNodeSidebar,
    },
    Renderer: DecisionNodeRenderer,
    type: plugin.typeName,
    pluginEntities: { inputs: z.record(plugin.inputType) },
  };
};
