import { Tabs, addNotification } from "@open-decision/design-system";
import { TEdgePluginGroup } from "@open-decision/plugins-edge-helpers";
import { TNodePluginGroup } from "@open-decision/plugins-node-helpers";
import { Renderer } from "@open-decision/renderer";
import { useTree } from "@open-decision/tree-sync";
import { useEditor, useSelectedNodeIds } from "../../../state";

type Props = {
  nodePlugins: TNodePluginGroup;
  edgePlugins: TEdgePluginGroup;
};

export function SidebarPreview({ nodePlugins, edgePlugins }: Props) {
  const tree = useTree((treeClient) => treeClient.get.tree());
  const selectedNodeIds = useSelectedNodeIds();
  const { replaceSelectedNodes } = useEditor();

  return (
    <Tabs.Content value="Vorschau" className="h-full">
      <Renderer.Root
        isInteractive={false}
        environment="private"
        edgePlugins={edgePlugins}
        tree={tree}
        initialNode={selectedNodeIds[0]}
        onSelectedNodeChange={(nextNodeId) =>
          replaceSelectedNodes([nextNodeId])
        }
        onError={(error) =>
          addNotification({
            title: error.code,
            content: error.message,
            variant: "danger",
          })
        }
      >
        <Renderer.View
          className="h-full gap-4"
          nodePlugins={nodePlugins}
          edgePlugins={edgePlugins}
        />
      </Renderer.Root>
    </Tabs.Content>
  );
}
