import {
  Button,
  Icon,
  DropdownMenu,
  Tooltip,
} from "@open-decision/design-system";
import {
  HamburgerMenuIcon,
  RocketIcon,
  TrashIcon,
  MoonIcon,
} from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { useEditor } from "../../state";

type Props = {
  isStartNode?: boolean;
  nodeId: string;
  name: string;
  className?: string;
} & DropdownMenu.ContentProps;

export function NodeMenu({
  isStartNode = false,
  name,
  nodeId,
  className,
  ...props
}: Props) {
  const t = useTranslations("builder.nodeEditingSidebar.menu");
  const { removeSelectedNodes } = useEditor();
  const treeClient = useTreeClient();

  const node = useTree((treeClient) => treeClient.nodes.get.single(nodeId));

  if (node instanceof Error) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          size="small"
          variant="secondary"
          className={`colorScheme-gray ${className}`}
          square
        >
          <Icon label={t("iconLabel", { name })}>
            <HamburgerMenuIcon />
          </Icon>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content {...props}>
        {isStartNode ? (
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <DropdownMenu.Item
                onSelect={() => treeClient.nodes.delete([nodeId])}
                className="colorScheme-danger"
                disabled
              >
                <Icon>
                  <TrashIcon />
                </Icon>
                {t("deleteNode.label")}
              </DropdownMenu.Item>
            </Tooltip.Trigger>
            <Tooltip.Content side="bottom">
              {t("deleteNode.disabledForStartNodeLabel")}
            </Tooltip.Content>
          </Tooltip.Root>
        ) : (
          <>
            <DropdownMenu.Item
              onSelect={() => treeClient.updateStartNode(nodeId)}
            >
              <Icon>
                <RocketIcon />
              </Icon>
              {t("makeStartNode.label")}
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={() =>
                treeClient.nodes.update.final(nodeId, !node.final)
              }
            >
              {node.final ? (
                <>
                  <Icon>
                    <MoonIcon />
                  </Icon>
                  {t("endNode.remove.label")}
                </>
              ) : (
                <>
                  <Icon>
                    <MoonIcon />
                  </Icon>
                  {t("endNode.add.label")}
                </>
              )}
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={() => {
                treeClient.nodes.delete([nodeId]);
                removeSelectedNodes();
              }}
              className="colorScheme-danger"
            >
              <Icon>
                <TrashIcon />
              </Icon>
              {t("deleteNode.label")}
            </DropdownMenu.Item>
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
