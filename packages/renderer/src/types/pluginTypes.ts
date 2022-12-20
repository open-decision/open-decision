import { ClassNameArrayProp } from "@open-decision/design-system";
import { NodePluginObject } from "@open-decision/plugins-node-helpers";

export type NodeRendererProps = {
  nodeId: string;
  className?: string;
  withNavigation?: boolean;
  classNames?: ClassNameArrayProp;
};

export type NodeRenderer = (props: NodeRendererProps) => JSX.Element | null;

export type RendererNodePluginObject = {
  Renderer: NodeRenderer | null;
} & NodePluginObject;
