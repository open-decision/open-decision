import { Button, Heading, Row, Stack } from "@open-decision/design-system";
import { useTreeClient } from "@open-decision/tree-sync";
import { NodeSidebar } from "../components/NodeSidebar/NodeSidebar";
import { sidebarCardClasses } from "../components";
import { useTranslations } from "next-intl";
import {
  getAddableNodePlugins,
  TNodeSidebar,
} from "@open-decision/plugins-node-helpers";

export const PlaceholderNodeSidebar: TNodeSidebar = ({
  nodeId,
  nodePlugins,
  edgePlugins,
}) => {
  const t = useTranslations("common.nodeNames");
  const treeClient = useTreeClient();

  const addableNodePlugins = getAddableNodePlugins(nodePlugins);

  return (
    <NodeSidebar
      nodeId={nodeId}
      edgePlugins={edgePlugins}
      nodePlugins={nodePlugins}
    >
      <Heading className="mb-4" size="small">
        Wähle einen Typ für diesen Knoten aus:
      </Heading>
      <Stack className="gap-2">
        {Object.values(addableNodePlugins).map(({ plugin }) => {
          return (
            <Row
              classNames={[sidebarCardClasses, "items-center justify-between"]}
              key={plugin.type}
            >
              <Heading size="extra-small">{t(`${plugin.type}.short`)}</Heading>
              <Button
                aria-label={`Erstelle ${t(`${plugin.type}.long`)}`}
                size="small"
                variant="secondary"
                onClick={() => {
                  const newNode = plugin.create({})(treeClient);
                  const oldNode = treeClient.nodes.get.single(nodeId);

                  if (oldNode instanceof Error) {
                    oldNode.message = `A placeholder node should be transformed into a ${newNode.type}. The placeholder of ${nodeId} could however not be found in the tree.`;
                    throw oldNode;
                  }

                  treeClient.nodes.update.node(nodeId, {
                    ...newNode,
                    name: oldNode.name,
                    position: oldNode.position,
                  } as any);
                }}
              >
                Erstellen
              </Button>
            </Row>
          );
        })}
      </Stack>
    </NodeSidebar>
  );
};
