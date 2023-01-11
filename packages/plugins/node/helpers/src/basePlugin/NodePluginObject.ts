import { ClassNameArrayProp, onNodeCreate } from "@open-decision/design-system";
import { EdgePluginObject } from "@open-decision/plugins-edge-helpers";
import {
  TEntityPluginBase,
  TNodePlugin,
  NodePlugin,
} from "@open-decision/tree-type";
import { NodeProps } from "reactflow";

export type NodePluginProps = NodeProps & {
  className?: string;
};

export type CanvasNode = (props: NodePluginProps) => JSX.Element | null;

export type TNodeSidebarProps = {
  nodeId: string;
  className?: string;
  children?: React.ReactNode;
  onNodeCreate: onNodeCreate;
  tabs?: string[];
  initialTab?: string;
  hasPreview?: boolean;
  edgePlugins: Record<string, EdgePluginObject>;
  nodePlugins: Record<string, NodePluginObject>;
};

export type TNodeSidebar = (props: TNodeSidebarProps) => JSX.Element | null;

export type NodeRendererProps = {
  nodeId: string;
  className?: string;
  withNavigation?: boolean;
  classNames?: ClassNameArrayProp;
  nodePlugins: Record<string, NodePluginObject>;
  edgePlugins: Record<string, EdgePluginObject>;
};

export type NodeRenderer = (props: NodeRendererProps) => JSX.Element | null;

export type NodePluginObject<
  TType extends TNodePlugin = TNodePlugin,
  TPluginEntities extends TEntityPluginBase = TEntityPluginBase
> = {
  Editor: {
    Node: CanvasNode;
    Sidebar: TNodeSidebar;
  };
  Renderer: NodeRenderer | null;
  plugin: NodePlugin<TType>;
  type: TType["type"];
  pluginEntities?: TPluginEntities;
  Icon: React.ForwardRefExoticComponent<
    any & React.RefAttributes<SVGSVGElement>
  >;
};
