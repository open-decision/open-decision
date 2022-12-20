import { CanvasNode } from "../plugin";
import { NodePluginObject } from "@open-decision/plugins-node-helpers";
import { RendererNodePluginObject } from "@open-decision/renderer";
import { EdgePluginObject } from "@open-decision/plugins-edge-helpers";
import { onNodeCreate } from "@open-decision/design-system";

export type TNodeSidebarProps = {
  nodeId: string;
  className?: string;
  children?: React.ReactNode;
  onNodeCreate: onNodeCreate;
  tabs?: string[];
  initialTab?: string;
  hasPreview?: boolean;
  edgePlugins: Record<string, EdgePluginObject>;
  nodePlugins: Record<string, RendererNodePluginObject>;
};

export type TNodeSidebar = (props: TNodeSidebarProps) => JSX.Element | null;

export type EditorPluginObject = {
  Editor: {
    Node: CanvasNode;
    Sidebar: TNodeSidebar;
  };
} & NodePluginObject;
