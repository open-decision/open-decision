import * as React from "react";
import { StyleObject } from "@open-decision/design-system";
import { Renderer } from "@open-decision/renderer";
import { getTree } from "@open-decision/tree-type";
import { useTree } from "@open-decision/tree-sync";
import { useNotificationStore } from "../../config/notifications";
import { useEditor, useSelectedNodeIds } from "@open-decision/node-editor";
import { useTreeClient } from "../Builder/components/TreeClient";

type Props = { css?: StyleObject };

export function Preview({ css }: Props) {
  const { replaceSelectedNodes } = useEditor();
  const tree = useTree((tree) => getTree(tree)());
  const selectedNodeIds = useSelectedNodeIds();
  const { addNotification } = useNotificationStore();
  const { nodePlugins, interpreterResolver } = useTreeClient();

  return (
    <Renderer.Root
      resolver={interpreterResolver}
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
        css={{
          height: "100%",
          paddingBlock: "$7",
          ...css,
        }}
        nodePlugins={nodePlugins}
        inputPlugins={nodePlugins.QuestionNode.plugin.inputPlugins}
      />
    </Renderer.Root>
  );
}
