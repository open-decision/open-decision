import * as React from "react";
import { StyleObject } from "@open-decision/design-system";
import { Renderer } from "@open-decision/renderer";
import { useTreeContext } from "../Builder/state/treeStore/TreeContext";
import { useSnapshot } from "valtio";
import { useNotificationStore } from "../../config/notifications";
import { useEditor } from "../Builder/state/useEditor";

type Props = { css?: StyleObject };

export function Preview({ css }: Props) {
  const { tree } = useTreeContext();
  const { replaceSelectedNodes } = useEditor();
  const { syncedStore: treeSnapshot, nonSyncedStore: userState } =
    useSnapshot(tree);
  const { addNotification } = useNotificationStore();

  return (
    <Renderer.Root
      tree={treeSnapshot}
      defaultNode={userState.selectedNodeIds[0]}
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
