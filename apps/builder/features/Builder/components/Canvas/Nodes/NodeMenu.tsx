import {
  Button,
  Icon,
  DropdownMenu,
  Tooltip,
  StyleObject,
} from "@open-decision/design-system";
import {
  HamburgerMenuIcon,
  RocketIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { useTreeContext } from "../../../../../features/Builder/state/treeStore/TreeContext";

type Props = {
  isStartNode?: boolean;
  nodeId: string;
  name: string;
  css?: StyleObject;
};

export function NodeMenu({ isStartNode = false, name, nodeId, css }: Props) {
  const t = useTranslations("builder.nodeEditingSidebar.menu");
  const { deleteNodes, updateStartNode, removeSelectedNodes } =
    useTreeContext();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          size="small"
          variant="secondary"
          css={{
            colorScheme: "gray",
            ...css,
          }}
          square
        >
          <Icon label={t("iconLabel", { name })}>
            <HamburgerMenuIcon />
          </Icon>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content css={{ groupColor: "$gray12" }}>
        {isStartNode ? (
          <Tooltip.Root>
            <Tooltip.Trigger style={{ all: "unset" }}>
              <DropdownMenu.Item
                onSelect={() => deleteNodes([nodeId])}
                css={{ colorScheme: "danger" }}
                disabled
              >
                <Icon css={{ $$paddingInline: 0 }}>
                  <TrashIcon />
                </Icon>
                {t("deleteNode.label")}
              </DropdownMenu.Item>
            </Tooltip.Trigger>
            <Tooltip.Content side="bottom">
              <Tooltip.Title>
                {t("deleteNode.disabledForStartNodeLabel")}
              </Tooltip.Title>
            </Tooltip.Content>
          </Tooltip.Root>
        ) : (
          <>
            <DropdownMenu.Item onSelect={() => updateStartNode(nodeId)}>
              <Icon css={{ $$paddingInline: 0 }}>
                <RocketIcon />
              </Icon>
              {t("makeStartNode.label")}
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={() => {
                deleteNodes([nodeId]);
                removeSelectedNodes();
              }}
              css={{ colorScheme: "danger" }}
            >
              <Icon css={{ $$paddingInline: 0 }}>
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
