import { ClassNameArrayProp, onNodeCreate } from "@open-decision/design-system";
import { EdgePluginObject } from "@open-decision/plugins-edge-helpers";
import {
  INodePlugin,
  isNodeId,
  NodePlugin,
  NodePluginWithVariable,
  TNodeId,
} from "@open-decision/tree-type";
import { NodeProps } from "reactflow";
import { mapValues, omitBy, pickBy } from "remeda";
import { z } from "zod";

export type NodePluginProps = Omit<NodeProps, "id"> & {
  className?: string;
  children?: React.ReactNode;
  id: TNodeId;
};

export type CanvasNode = (props: NodePluginProps) => JSX.Element | null;

export type TNodeSidebarProps = {
  nodeId: TNodeId;
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
  nodeId: TNodeId;
  className?: string;
  withNavigation?: boolean;
  classNames?: ClassNameArrayProp;
  nodePlugins: TNodePluginGroup;
  edgePlugins: Record<string, EdgePluginObject>;
};

export type NodeRenderer = (props: NodeRendererProps) => JSX.Element | null;

export interface NodePluginObject<
  TType extends INodePlugin = INodePlugin,
  TPluginEntities extends Record<string, z.ZodTypeAny> = Record<
    string,
    z.ZodTypeAny
  >,
  TZodType extends z.AnyZodObject = z.AnyZodObject
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
  Type: TZodType;
}

export interface NodePluginObjectWithVariable<
  TType extends INodePlugin = INodePlugin,
  TPluginEntities extends Record<string, z.ZodTypeAny> = Record<
    string,
    z.ZodTypeAny
  >
> extends NodePluginObject<TType, TPluginEntities> {
  plugin: NodePluginWithVariable<TType>;
}

export const createNodePluginObject = <
  TType extends INodePlugin = INodePlugin,
  TPluginEntities extends Record<string, z.ZodTypeAny> = Record<
    string,
    z.ZodTypeAny
  >
>(
  pluginObj: NodePluginObject<TType, TPluginEntities>
) => {
  return {
    ...pluginObj,
    Editor: {
      ...pluginObj.Editor,
      Node: ({
        id,
        ...props
      }: Omit<NodePluginProps, "id"> & { id: string }) => {
        if (!isNodeId(id)) return null;

        return <pluginObj.Editor.Node {...props} id={id} />;
      },
    },
  } satisfies NodePluginObject<TType, TPluginEntities>;
};

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
    Sidebars: mapValues(nodePlugins, (plugin) => plugin.Editor.Sidebar),
    Renderers: mapValues(nodePlugins, (plugin) => plugin.Renderer),
    Icons: mapValues(nodePlugins, (plugin) => plugin.Icon),
    Nodes: mapValues(nodePlugins, (plugin) => plugin.Editor.Node),
  };
};

export type TNodePluginGroup = ReturnType<typeof createNodePluginGroup>;
