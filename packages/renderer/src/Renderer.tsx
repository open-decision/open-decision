import { StackProps } from "@open-decision/design-system";
import * as React from "react";
import {
  InterpreterProvider,
  InterpreterProviderProps,
  useInterpreter,
} from "@open-decision/interpreter-react";
import { TNodePluginGroup } from "@open-decision/plugins-node-helpers";
import { TEdgePluginGroup } from "@open-decision/plugins-edge-helpers";
import { TNodeId } from "@open-decision/tree-id";

export type ViewProps = {
  nodeId?: string;
  nodePlugins: TNodePluginGroup;
  edgePlugins: TEdgePluginGroup;
  withNavigation?: boolean;
  canGoBack?: true;
  onGoBack?: () => void;
  parentId?: TNodeId;
} & StackProps;

export function View({
  nodePlugins,
  className,
  withNavigation,
  classNames,
  edgePlugins,
}: ViewProps) {
  const { getCurrentNode } = useInterpreter();
  const node = getCurrentNode();

  if (node instanceof Error) return null;

  const Renderer = nodePlugins.Renderers[node.type];

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

export type ProviderProps = InterpreterProviderProps;

export const Root = ({ children, treeUuid, ...props }: ProviderProps) => {
  return (
    <InterpreterProvider treeUuid={treeUuid} {...props}>
      {children}
    </InterpreterProvider>
  );
};
