import { Node } from "@open-decision/tree-type";
import { z } from "zod";
import { CanvasNode } from "../plugin";
import { NodePlugin } from "@open-decision/plugins-node-helpers";

export type NodeSidebarProps = {
  nodeId: string;
  className?: string;
  children?: React.ReactNode;
  onNodeCreate: (
    nodeData: Partial<Omit<Node.TNode, "id" | "data" | "type">>
  ) => Node.TNode;
};

export type TNodeSidebar = (props: NodeSidebarProps) => JSX.Element;

export type RendererNodeContentProps<TNode extends Node.TNode> = {
  node: TNode;
};

export type RendererNodeContent<TNode extends Node.TNode> = (
  props: RendererNodeContentProps<TNode>
) => JSX.Element | null;

export type RendererNodeActionsProps<TNode extends Node.TNode> = {
  node: TNode;
  children: React.ReactNode;
  className?: string;
};

export type RendererNodeActions<TNode extends Node.TNode> = (
  props: RendererNodeActionsProps<TNode>
) => JSX.Element | null;

export type NodePluginObject<
  TType extends z.ZodType = any,
  TTypeName extends string = string,
  TNode extends Node.TNode = any,
  TPluginEntities extends z.ZodRawShape = any
> = {
  plugin: NodePlugin<TType, TTypeName>;
  Node: CanvasNode;
  Sidebar: TNodeSidebar;
  Renderer?: {
    Content: RendererNodeContent<TNode>;
    Actions?: RendererNodeActions<TNode>;
  };
  type: string;
  pluginEntities?: TPluginEntities;
};
