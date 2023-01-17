import { ClassNameArrayProp, onNodeCreate } from "@open-decision/design-system";
import { TEdgePluginGroup } from "@open-decision/plugins-edge-helpers";
import {
  INodePlugin,
  isNodeId,
  NodePlugin,
  NodePluginWithVariable,
  TNodeId,
} from "@open-decision/tree-type";
import { NodeProps } from "reactflow";
import { z } from "zod";
import { TNodePluginGroup } from "./createNodePluginGroup";

export type NodePluginProps = Omit<NodeProps, "id"> & {
  className?: string;
  children?: React.ReactNode;
  id: TNodeId;
};

export type TCanvasNode = (props: NodePluginProps) => JSX.Element | null;

export type TNodeSidebarProps = {
  nodeId: TNodeId;
  className?: string;
  children?: React.ReactNode;
  onNodeCreate: onNodeCreate;
  tabs?: string[];
  initialTab?: string;
  hasPreview?: boolean;
  edgePlugins: TEdgePluginGroup;
  nodePlugins: TNodePluginGroup;
};

export type TNodeSidebar = (props: TNodeSidebarProps) => JSX.Element | null;

export type NodeRendererProps = {
  nodeId: TNodeId;
  className?: string;
  withNavigation?: boolean;
  classNames?: ClassNameArrayProp;
  nodePlugins: TNodePluginGroup;
  edgePlugins: TEdgePluginGroup;
};

export type TNodeRenderer = (props: NodeRendererProps) => JSX.Element | null;

interface BaseNodePluginObject<
  TType extends INodePlugin = INodePlugin,
  TPluginEntities extends Record<string, z.ZodTypeAny> = Record<
    string,
    z.ZodTypeAny
  >,
  TZodType extends z.AnyZodObject = z.AnyZodObject
> {
  Editor: {
    Node: TCanvasNode;
    Sidebar: TNodeSidebar;
  };
  Renderer: TNodeRenderer | null;
  type: TType["type"];
  pluginEntities?: TPluginEntities;
  Icon: React.ForwardRefExoticComponent<
    any & React.RefAttributes<SVGSVGElement>
  >;
  Type: TZodType;
}

export interface NodePluginObject<
  TType extends INodePlugin = INodePlugin,
  TPluginEntities extends Record<string, z.ZodTypeAny> = Record<
    string,
    z.ZodTypeAny
  >
> extends BaseNodePluginObject<TType, TPluginEntities> {
  plugin: NodePlugin<TType>;
}

export interface NodePluginObjectWithVariable<
  TType extends INodePlugin = INodePlugin,
  TPluginEntities extends Record<string, z.ZodTypeAny> = Record<
    string,
    z.ZodTypeAny
  >
> extends BaseNodePluginObject<TType, TPluginEntities> {
  plugin: NodePluginWithVariable<TType>;
}

export const createNodePluginObject = <
  TNodePluginObject extends NodePluginObject = NodePluginObject
>(
  pluginObj: TNodePluginObject
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
  } satisfies TNodePluginObject;
};
