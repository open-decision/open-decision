import { Button, Heading, Row, Stack } from "@open-decision/design-system";
import { useTreeClient } from "@open-decision/tree-sync";
import { NodeSidebar } from "../components/NodeSidebar/NodeSidebar";
import { sidebarCardClasses } from "../components";
import { useTranslations } from "next-intl";
import { TNodeSidebar } from "@open-decision/plugins-node-helpers";

export const PlaceholderNodeSidebar: TNodeSidebar = ({
  nodeId,
  nodePlugins,
  edgePlugins,
}) => {
  const t = useTranslations("common.nodeNames");
  const treeClient = useTreeClient();

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
        {Object.values(nodePlugins.addablePlugins).map((plugin) => {
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

                  if (!oldNode) return;

                  treeClient.nodes.update.node(nodeId, {
                    ...newNode,
                    name: oldNode.name,
                    position: oldNode.position,
                  });
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
