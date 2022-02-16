import {
  Button,
  Icon,
  DropdownMenu,
  Tooltip,
  Text,
  StyleObject,
} from "@open-legal-tech/design-system";
import { useTree } from "features/Builder/state/treeMachine/useTree";
import { MoreHorizontal, Trash, Star } from "react-feather";

type Props = {
  isStartNode?: boolean;
  nodeId: string;
  name: string;
  css?: StyleObject;
};

export function NodeMenu({ isStartNode = false, name, nodeId, css }: Props) {
  const [, send] = useTree();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          size="extra-small"
          variant="tertiary"
          css={{
            border: "1px solid $gray8",
            colorScheme: "gray",
            backgroundColor: "$gray1",
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
            <Tooltip.Trigger asChild>
              <DropdownMenu.Item
                css={{ colorScheme: "danger" }}
                onSelect={() => send({ type: "deleteNode", ids: [nodeId] })}
                disabled
              >
                <Icon
                  label="Löschen Icon"
                  size="extra-small"
                  css={{ $$paddingInline: 0 }}
                >
                  <Trash />
                </Icon>
                Node löschen
              </DropdownMenu.Item>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Text>Die Startnode kann nicht entfernt werden.</Text>
            </Tooltip.Content>
          </Tooltip.Root>
        ) : (
          <>
            <DropdownMenu.Item
              css={{ colorScheme: "primary" }}
              onSelect={() =>
                send({ type: "updateTree", tree: { startNode: nodeId } })
              }
            >
              <Icon
                label="Zur Startnode machen"
                size="extra-small"
                css={{ $$paddingInline: 0 }}
              >
                <Star />
              </Icon>
              Zur Startnode machen
            </DropdownMenu.Item>
            <DropdownMenu.Item
              css={{ colorScheme: "danger" }}
              onSelect={() => send({ type: "deleteNode", ids: [nodeId] })}
            >
              <Icon
                label="Löschen Icon"
                size="extra-small"
                css={{ $$paddingInline: 0 }}
              >
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
