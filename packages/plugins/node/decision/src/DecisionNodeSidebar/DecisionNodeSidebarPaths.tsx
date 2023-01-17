import { stackClasses, Tabs } from "@open-decision/design-system";
import { SidebarButton } from "@open-decision/node-editor";
import { CompareEdgePlugin } from "@open-decision/plugins-edge-compare";
import { TNodeSidebarProps } from "@open-decision/plugins-node-helpers";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { TNodeId } from "@open-decision/tree-type";
import { ODError } from "@open-decision/type-classes";
import { PathCard } from "./PathCard";

const CompareEdge = new CompareEdgePlugin();

type Props = {
  nodeId: TNodeId;
} & Pick<TNodeSidebarProps, "onNodeCreate" | "edgePlugins">;

export function DecisionNodeSidebarPaths({ nodeId, onNodeCreate }: Props) {
  const treeClient = useTreeClient();

  const edges = useTree((treeClient) => {
    return CompareEdge.getByNode(nodeId)(treeClient);
  });

  return (
    <Tabs.Content value="Pfade" className={stackClasses({}, "gap-4")}>
      {Object.values(edges?.source ?? {}).map((edge) => (
        <PathCard
          key={edge.id}
          edge={edge}
          nodeId={nodeId}
          onNodeCreate={onNodeCreate}
          onEdgeCreate={({ source, target }) =>
            CompareEdge.create({
              source,
              target,
              condition: { variableId: nodeId, valueIds: [] },
            })
          }
        />
      ))}
      <SidebarButton
        onClick={() => {
          const newEdge = CompareEdge.create({
            source: nodeId,
            condition: { variableId: nodeId, valueIds: [] },
          })(treeClient);

          if (newEdge instanceof ODError) return;

          treeClient.edges.add(newEdge);
        }}
      >
        Pfad hinzufügen
      </SidebarButton>
    </Tabs.Content>
  );
}
