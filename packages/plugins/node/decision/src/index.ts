import { DecisionCanvasNode } from "./DecisionCanvasNode";
import { DecisionNodePlugin } from "./DecisionNodePlugin";
import { DecisionNodeSidebar } from "./DecisionNodeSidebar/DecisionNodeSidebar";
import { DecisionNodeRenderer } from "./DecisionNodeRenderer";
import { Pencil1Icon } from "@radix-ui/react-icons";
import {
  createNodePluginObject,
  ZInputId,
} from "@open-decision/plugins-node-helpers";
import { ZNodePlugin } from "@open-decision/tree-type";
import { RichText } from "@open-decision/rich-text-editor";
import { z } from "zod";

export * from "./DecisionNodePlugin";

const plugin = new DecisionNodePlugin();

const ZDecisionNode = ZNodePlugin.extend({
  type: z.literal(plugin.type),
  content: RichText.optional(),
  input: ZInputId.optional(),
});

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
  Type: ZDecisionNode,
});
