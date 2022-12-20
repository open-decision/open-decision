import { Button, stackClasses, Tabs } from "@open-decision/design-system";
import { TNodeSidebarProps } from "@open-decision/node-editor";
import { CompareEdgePlugin } from "@open-decision/plugins-edge-compare";
import { EdgePluginObject } from "@open-decision/plugins-edge-helpers";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { ODError } from "@open-decision/type-classes";
import { PathCard } from "./PathCard";

const CompareEdge = new CompareEdgePlugin();

type Props = {
  nodeId: string;
  edgePlugins: Record<string, EdgePluginObject>;
} & Pick<TNodeSidebarProps, "onNodeCreate">;

export function DecisionNodeSidebarPaths({ nodeId, onNodeCreate }: Props) {
  const treeClient = useTreeClient();

  const edges = useTree((treeClient) => {
    return CompareEdge.get.byNode(nodeId)(treeClient);
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
              data: { condition: { variableId: nodeId, valueIds: [] } },
            })
          }
        />
      ))}
      <Button
        className="w-full"
        variant="secondary"
        size="small"
        onClick={() => {
          const newEdge = CompareEdge.create({
            source: nodeId,
            data: { condition: { variableId: nodeId, valueIds: [] } },
          })(treeClient);

          if (newEdge instanceof ODError) return;

          treeClient.edges.add(newEdge);
        }}
      >
        Pfad hinzufügen
      </Button>
    </Tabs.Content>
  );
}
