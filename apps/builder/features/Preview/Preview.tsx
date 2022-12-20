import * as React from "react";
import { Renderer } from "@open-decision/renderer";
import { useTree } from "@open-decision/tree-sync";
import { useNotificationStore } from "../../config/notifications";
import { useEditor, useSelectedNodeIds } from "@open-decision/node-editor";
import { useTreeClientWithPlugins } from "@open-decision/tree-clientWithPlugins";
import { InterpreterProviderProps } from "@open-decision/interpreter-react";

type Props = {
  className?: string;
  environment: InterpreterProviderProps["environment"];
};

export function Preview({ className, environment }: Props) {
  const { replaceSelectedNodes } = useEditor();
  const tree = useTree((treeClient) => treeClient.get.tree());
  const selectedNodeIds = useSelectedNodeIds();
  const { addNotification } = useNotificationStore();
  const { nodePlugins, edgePlugins } = useTreeClientWithPlugins();

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
      <Renderer.View
        classNames={["h-full py-7", className]}
        nodePlugins={nodePlugins}
      />
    </Renderer.Root>
  );
}
