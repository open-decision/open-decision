import { ClassNameArrayProp, onNodeCreate } from "@open-decision/design-system";
import { EdgePluginObject } from "@open-decision/plugins-edge-helpers";
import {
  IEntityPluginBase,
  INodePlugin,
  NodePlugin,
  NodePluginWithVariable,
} from "@open-decision/tree-type";
import { NodeProps } from "reactflow";
import { mapValues, omitBy, pickBy } from "remeda";

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
  nodePlugins: TNodePluginGroup;
};

export type TNodeSidebar = (props: TNodeSidebarProps) => JSX.Element | null;

export type NodeRendererProps = {
  nodeId: string;
  className?: string;
  withNavigation?: boolean;
  classNames?: ClassNameArrayProp;
  nodePlugins: TNodePluginGroup;
  edgePlugins: Record<string, EdgePluginObject>;
};

export type NodeRenderer = (props: NodeRendererProps) => JSX.Element | null;

export interface NodePluginObject<
  TType extends INodePlugin = INodePlugin,
  TPluginEntities extends IEntityPluginBase = IEntityPluginBase
> {
  Editor: {
    Node: CanvasNode;
    Sidebar: TNodeSidebar;
  };
  Renderer: NodeRenderer | null;
  type: TType["type"];
  pluginEntities?: TPluginEntities;
  Icon: React.ForwardRefExoticComponent<
    any & React.RefAttributes<SVGSVGElement>
  >;
  plugin: NodePlugin<TType> | NodePluginWithVariable<TType>;
}

export interface NodePluginObjectWithVariable<
  TType extends INodePlugin = INodePlugin,
  TPluginEntities extends IEntityPluginBase = IEntityPluginBase
> extends NodePluginObject<TType, TPluginEntities> {
  plugin: NodePluginWithVariable<TType>;
}

export const createNodePluginGroup = (
  nodePlugins: Record<string, NodePluginObject>
) => {
  const plugins = mapValues(nodePlugins, (plugin) => plugin.plugin);

  const pluginsWithVariable = pickBy(
    plugins,
    (plugin) => plugin instanceof NodePluginWithVariable
  ) as Record<string, NodePluginWithVariable>;

  const addablePlugins = omitBy(plugins, (plugin) => !plugin.isAddable);

  return {
    plugins,
    pluginsWithVariable,
    pluginObjects: nodePlugins,
    addablePlugins,
  };
};

export type TNodePluginGroup = ReturnType<typeof createNodePluginGroup>;
