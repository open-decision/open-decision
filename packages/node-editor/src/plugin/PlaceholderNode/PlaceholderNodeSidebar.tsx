import { Button } from "@open-decision/design-system";
import { EdgePluginObject } from "@open-decision/plugins-edge-helpers";
import { useTreeClient } from "@open-decision/tree-sync";
import { TNodeSidebar } from "../../types/EditorPluginObject";
import { NodeSidebar } from "../components/NodeSidebar/NodeSidebar";
import { RendererNodePluginObject } from "@open-decision/renderer";

export const createNodeSidebar = <
  TNodePlugins extends Record<string, RendererNodePluginObject>
>(
  nodePlugins: TNodePlugins,
  edgePlugins: Record<string, EdgePluginObject>
) => {
  const Sidebar: TNodeSidebar = ({ nodeId }) => {
    const treeClient = useTreeClient();

    return (
      <NodeSidebar
        nodeId={nodeId}
        edgePlugins={edgePlugins}
        nodePlugins={nodePlugins}
      >
        {Object.values(nodePlugins).map(({ plugin }) => {
          return (
            <Button
              key={plugin.typeName}
              onClick={() => {
                const newNode = plugin.create({})(treeClient);
                const oldNode = treeClient.nodes.get.single(nodeId);

                if (oldNode instanceof Error) {
                  oldNode.message = `A placeholder node should be transformed into a ${newNode.type}. The placeholder of ${nodeId} could however not be found in the tree.`;
                  throw oldNode;
                }

                // FIXME the any type cast is not good
                treeClient.nodes.update.node(nodeId, {
                  ...newNode,
                  name: oldNode.name,
                  position: oldNode.position,
                } as any);
              }}
            >
              {plugin.typeName}
            </Button>
          );
        })}
      </NodeSidebar>
    );
  };

  return Sidebar;
};
