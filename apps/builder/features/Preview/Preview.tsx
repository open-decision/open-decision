import * as React from "react";
import { StyleObject } from "@open-decision/design-system";
import { Renderer } from "@open-decision/renderer";
import { getTree, useTree } from "@open-decision/tree-sync";
import { useNotificationStore } from "../../config/notifications";
import { useEditor } from "../Builder/state/useEditor";
import { useSelectedNodeIds } from "../Builder/state/useSelectedNodes";
import { interpreterPlugin } from "@open-decision/tree-client";

type Props = { css?: StyleObject };

export function Preview({ css }: Props) {
  const { replaceSelectedNodes } = useEditor();
  const tree = useTree((tree) => getTree(tree)());
  const selectedNodeIds = useSelectedNodeIds();

  const { addNotification } = useNotificationStore();

  return (
    <Renderer.Root
      // FIXME this needs to be a proper resolver
      resolver={interpreterPlugin}
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
      />
    </Renderer.Root>
  );
}
