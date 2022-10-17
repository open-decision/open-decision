import { Node } from "@open-decision/tree-type";
import { NodePlugin } from "../plugin/NodePlugin";
import { z } from "zod";
import { NodeProps } from "reactflow";
import { NodePluginData } from "../state";
import { StyleObject } from "@open-decision/design-system";
import { InputPluginObject } from "@open-decision/input-plugins-helpers";

export type CanvasNodeProps<TNode extends Node.TNode> = NodeProps<
  NodePluginData<TNode>
>;

export type CanvasNode<TNode extends Node.TNode> = (
  props: CanvasNodeProps<TNode>
) => JSX.Element;

export type NodeSidebarProps<TNode extends Node.TNode> = {
  node: TNode;
  open: boolean;
};

export type NodeSidebar<TNode extends Node.TNode> = (
  props: NodeSidebarProps<TNode>
) => JSX.Element;

export type RendererNodeContentProps<TNode extends Node.TNode> = {
  node: TNode;
};

export type RendererNodeContent<TNode extends Node.TNode> = (
  props: RendererNodeContentProps<TNode>
) => JSX.Element | null;

export type RendererNodeActionsProps<TNode extends Node.TNode> = {
  node: TNode;
  css?: StyleObject;
  inputPlugins: Record<string, InputPluginObject>;
};

export type RendererNodeActions<TNode extends Node.TNode> = (
  props: RendererNodeActionsProps<TNode>
) => JSX.Element;

export type NodePluginObject<
  TType extends z.ZodType = any,
  TTypeName extends string = string,
  TNode extends Node.TNode = any,
  TPluginEntities extends z.ZodRawShape = any
> = {
  plugin: NodePlugin<TType, TTypeName>;
  Node: CanvasNode<TNode>;
  Sidebar: NodeSidebar<TNode>;
  Renderer?: {
    Content: RendererNodeContent<TNode>;
    Actions?: RendererNodeActions<TNode>;
  };
  type: string;
  pluginEntities: TPluginEntities;
};
