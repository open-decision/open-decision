import { StackProps } from "@open-decision/design-system";
import * as React from "react";
import {
  InterpreterProvider,
  InterpreterProviderProps,
  useInterpreter,
} from "@open-decision/interpreter-react";
import { RendererNodePluginObject } from "./types";

export type RendererProps = {
  nodeId?: string;
  nodePlugins: Record<string, RendererNodePluginObject>;
  withNavigation?: boolean;
} & StackProps;

export function View({
  nodePlugins,
  className,
  withNavigation,
  classNames,
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
    />
  );
}

export const Root = ({ children, ...props }: InterpreterProviderProps) => {
  return <InterpreterProvider {...props}>{children}</InterpreterProvider>;
};
