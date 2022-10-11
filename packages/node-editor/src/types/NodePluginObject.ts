import { Node } from "@open-decision/tree-type";
import { NodePlugin } from "../plugin/NodePlugin";
import { z } from "zod";
import { NodeProps } from "react-flow-renderer";
import { NodePluginData } from "../state";

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

export type NodePluginObject<
  TType extends z.ZodType,
  TTypeName extends string,
  TNode extends Node.TNode
> = {
  plugin: NodePlugin<TType, TTypeName>;
  Node: CanvasNode<TNode>;
  Sidebar: NodeSidebar<TNode>;
  type: string;
};
