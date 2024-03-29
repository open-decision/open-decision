import { StackProps } from "@open-decision/design-system";
import * as React from "react";
import {
  InterpreterProvider,
  InterpreterProviderProps,
  useInterpreter,
} from "@open-decision/interpreter-react";
import { NodePluginObject } from "@open-decision/plugins-node-helpers";
import { EdgePluginObject } from "@open-decision/plugins-edge-helpers";

export type RendererProps = {
  nodeId?: string;
  nodePlugins: Record<string, NodePluginObject>;
  edgePlugins: Record<string, EdgePluginObject>;
  withNavigation?: boolean;
} & StackProps;

export function View({
  nodePlugins,
  className,
  withNavigation,
  classNames,
  edgePlugins,
}: RendererProps) {
  const { getCurrentNode } = useInterpreter();
  const node = getCurrentNode();

  const Renderer = nodePlugins[node.type]?.Renderer;

  if (!Renderer) return null;

  return (
    <Renderer
      key={node.id}
      nodeId={node.id}
      className={className}
      withNavigation={withNavigation}
      classNames={classNames}
      nodePlugins={nodePlugins}
      edgePlugins={edgePlugins}
    />
  );
}

export const Root = ({ children, ...props }: InterpreterProviderProps) => {
  return <InterpreterProvider {...props}>{children}</InterpreterProvider>;
};
