import { DropdownMenu } from "@open-decision/design-system";
import { TNodePluginGroup } from "@open-decision/plugins-node-helpers";
import { useTreeClient } from "@open-decision/tree-sync";
import { INode } from "@open-decision/tree-type";
import { useTranslations } from "next-intl";

const hasContent = (node: any): node is { content: any } => {
  return node && node.content;
};

type Props = {
  nodePlugins: TNodePluginGroup;
  node: INode;
};

export function NodeDropdown({ nodePlugins, node }: Props) {
  const nodeNames = useTranslations("common.nodeNames");
  const treeClient = useTreeClient();

  const options = Object.values(nodePlugins.addablePlugins).filter(
    (plugin) => plugin.type !== node.type
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <DropdownMenu.Button variant="neutral">
          {nodeNames(`${node.type as any}.short`)}
        </DropdownMenu.Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start">
        {options.map((plugin) => (
          <DropdownMenu.Item
            key={plugin.type}
            onSelect={() => {
              const oldNode = treeClient.nodes.get.single(node.id);

              if (!oldNode) return;
              let oldNodeContent;

              if (hasContent(oldNode)) {
                oldNodeContent = oldNode.content;
              }

              const newNode = plugin.create({
                content: oldNodeContent,
                name: oldNode.name,
                position: oldNode.position,
              })(treeClient);

              treeClient.nodes.update.node(node.id, newNode);
            }}
          >
            {nodeNames(`${plugin.type}.short`)}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
