import * as React from "react";
import { Renderer } from "@open-decision/renderer";
import { useTree } from "@open-decision/tree-sync";
import { useEditor, useSelectedNodeIds } from "@open-decision/node-editor";
import { useTreeClientWithPlugins } from "@open-decision/tree-clientWithPlugins";
import { InterpreterProviderProps } from "@open-decision/interpreter-react";
import { addNotification } from "@open-decision/design-system";

type Props = {
  children: React.ReactNode;
  environment: InterpreterProviderProps["environment"];
};

export function PreviewRoot({ children, environment }: Props) {
  const { replaceSelectedNodes } = useEditor();
  const tree = useTree((treeClient) => treeClient.get.tree());
  const selectedNodeIds = useSelectedNodeIds();
  const { edgePlugins } = useTreeClientWithPlugins();

  return (
    <Renderer.Root
      environment={environment}
      edgePlugins={edgePlugins}
      tree={tree}
      initialNode={selectedNodeIds[0]}
      onSelectedNodeChange={(nextNodeId) => replaceSelectedNodes([nextNodeId])}
      onError={(error) =>
        addNotification({
          title: error.code,
          content: error.message,
          variant: "danger",
        })
      }
    >
      {children}
    </Renderer.Root>
  );
}

type ViewProps = {
  className?: string;
};

export function PreviewView({ className }: ViewProps) {
  const { nodePlugins, edgePlugins } = useTreeClientWithPlugins();

  return (
    <Renderer.View
      classNames={["h-full py-7", className]}
      nodePlugins={nodePlugins}
      edgePlugins={edgePlugins}
    />
  );
}
