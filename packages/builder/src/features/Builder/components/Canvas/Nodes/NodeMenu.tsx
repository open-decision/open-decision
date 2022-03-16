import {
  Button,
  Icon,
  DropdownMenu,
  Tooltip,
  StyleObject,
} from "@open-decision/design-system";
import { useTree } from "features/Builder/state/treeStore/TreeProvider";
import { MoreHorizontal, Trash, Star } from "react-feather";

type Props = {
  isStartNode?: boolean;
  nodeId: string;
  name: string;
  css?: StyleObject;
};

export function NodeMenu({ isStartNode = false, name, nodeId, css }: Props) {
  const { deleteNodes, updateStartNode } = useTree();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          size="small"
          variant="neutral"
          css={{
            focusStyle: "inner",
            ...css,
          }}
          square
        >
          <Icon label={`Öffne Menü Node: ${name}`}>
            <MoreHorizontal />
          </Icon>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {isStartNode ? (
          <Tooltip.Root>
            <Tooltip.Trigger style={{ all: "unset" }}>
              <DropdownMenu.Item
                onSelect={() => deleteNodes([nodeId])}
                disabled
              >
                <Icon label="Löschen Icon" css={{ $$paddingInline: 0 }}>
                  <Trash />
                </Icon>
                Node löschen
              </DropdownMenu.Item>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Tooltip.Title>
                Die Startnode kann nicht entfernt werden.
              </Tooltip.Title>
            </Tooltip.Content>
          </Tooltip.Root>
        ) : (
          <>
            <DropdownMenu.Item onSelect={() => updateStartNode(nodeId)}>
              <Icon label="Zur Startnode machen" css={{ $$paddingInline: 0 }}>
                <Star />
              </Icon>
              Zur Startnode machen
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={() => deleteNodes([nodeId])}>
              <Icon label="Löschen Icon" css={{ $$paddingInline: 0 }}>
                <Trash />
              </Icon>
              Node löschen
            </DropdownMenu.Item>
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
