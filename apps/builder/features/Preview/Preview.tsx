import * as React from "react";
import { Tabs, Stack } from "@open-decision/design-system";
import { Renderer } from "@open-decision/renderer";
import { useTreeContext } from "../Builder/state/treeStore/TreeContext";
import { useNotificationStore } from "../Notifications/NotificationState";
import { useSnapshot } from "valtio";

function VorschauPageImpl() {
  const { tree } = useTreeContext();
  const { syncedStore: treeSnapshot } = useSnapshot(tree);
  const { addNotification } = useNotificationStore();

  return (
    <Renderer.Root
      tree={treeSnapshot}
      onError={(error) =>
        addNotification({
          title: error.code,
          content: error.message,
          variant: "danger",
        })
      }
    >
      <Tabs.Content value="desktop" asChild>
        <Renderer.View
          css={{
            height: "100%",
            gridColumn: 2,
            paddingBlock: "$7",
          }}
        />
      </Tabs.Content>
      <Tabs.Content value="mobile" asChild>
        <Stack center css={{ gridColumn: 2 }}>
          <Renderer.View
            css={{
              width: "400px",
              height: "700px",
              layer: "2",
              boxShadow: "$6",
              border: "2px solid $gray7",
              borderRadius: "$xl",
              $$padding: "$space$5",
            }}
          />
        </Stack>
      </Tabs.Content>
    </Renderer.Root>
  );
}

export default VorschauPageImpl;
