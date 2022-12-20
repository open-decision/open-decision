import { Tabs, notificationState } from "@open-decision/design-system";
import { EdgePluginObject } from "@open-decision/plugins-edge-helpers";
import { Renderer, RendererNodePluginObject } from "@open-decision/renderer";
import { useTree } from "@open-decision/tree-sync";
import { useEditor, useSelectedNodeIds } from "../../../state";

type Props = {
  nodePlugins: Record<string, RendererNodePluginObject>;
  edgePlugins: Record<string, EdgePluginObject>;
};

export function SidebarPreview({ nodePlugins, edgePlugins }: Props) {
  const tree = useTree((treeClient) => treeClient.get.tree());
  const selectedNodeIds = useSelectedNodeIds();
  const { replaceSelectedNodes } = useEditor();

  return (
    <Tabs.Content value="Vorschau" className="h-full">
      <Renderer.Root
        environment="preview"
        edgePlugins={edgePlugins}
        tree={tree}
        initialNode={selectedNodeIds[0]}
        onSelectedNodeChange={(nextNodeId) =>
          replaceSelectedNodes([nextNodeId])
        }
        onError={(error) =>
          notificationState.addNotification({
            title: error.code,
            content: error.message,
            variant: "danger",
          })
        }
      >
        <Renderer.View className="h-full gap-4" nodePlugins={nodePlugins} />
      </Renderer.Root>
    </Tabs.Content>
  );
}
