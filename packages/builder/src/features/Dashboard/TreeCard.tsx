import * as React from "react";
import {
  Button,
  DropdownMenu,
  Heading,
  Icon,
  Stack,
  styled,
  Text,
  Badge,
  Row,
  Box,
  intentWithinSelector,
} from "@open-decision/design-system";
import { formatRelative, parseISO } from "date-fns";
import de from "date-fns/locale/de";
import { TreesQuery } from "features/Data/generated/graphql";
import { DeleteTreeDialog } from "./components/Dialogs/DeleteTreeDialog";
import Link from "next/link";
import { UpdateTreeDialog } from "./components/Dialogs/UpdateTreeDialog";
import {
  DotsHorizontalIcon,
  Pencil2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Card as DefaultCard } from "components/Card";

const readableStatus = {
  ACTIVE: "AKTIV",
  ARCHIVED: "Archiviert",
};

const Card = styled("a", Stack, DefaultCard, {
  position: "relative",
  textDecoration: "none",
});

type Props = { tree: TreesQuery["decisionTrees"][0] };

export function TreeCard({ tree }: Props) {
  const dropdownTriggerRef = React.useRef<HTMLButtonElement | null>(null);

  return (
    <Box
      css={{
        position: "relative",
        transition: "box-shadow 150ms ease-in",
        borderRadius: "$md",
        [`${intentWithinSelector}`]: { boxShadow: "$3" },
      }}
    >
      <Link href={`/builder/${tree.uuid}`} passHref>
        <Card title={`Öffne das Projekt ${tree.name}`}>
          <Row css={{ gap: "$2", alignItems: "center", marginBottom: "$1" }}>
            <Heading size="small" css={{}}>
              {tree.name}
            </Heading>
            {tree.status === "ACTIVE" ? (
              <Badge size="small">{readableStatus[tree.status]}</Badge>
            ) : null}
            {tree.status === "ARCHIVED" ? (
              <Badge css={{ colorScheme: "gray" }} size="small">
                {readableStatus[tree.status]}
              </Badge>
            ) : null}
          </Row>

          <Text css={{ color: "$gray11" }} size="small">
            {formatRelative(parseISO(tree.updatedAt), new Date(), {
              locale: de,
            })}
          </Text>
        </Card>
      </Link>
      <DropdownMenu.Root
        dialogs={{
          update: (
            <UpdateTreeDialog
              treeId={tree.uuid}
              focusOnClose={() => dropdownTriggerRef.current?.focus()}
            />
          ),
          delete: (
            <DeleteTreeDialog
              tree={tree}
              focusOnClose={() => dropdownTriggerRef.current?.focus()}
            />
          ),
        }}
      >
        <DropdownMenu.Trigger asChild ref={dropdownTriggerRef}>
          <Button
            variant="ghost"
            square
            css={{ position: "absolute", right: 20, top: 12 }}
          >
            <Icon label={`Projektmenü ${tree.name}`}>
              <DotsHorizontalIcon />
            </Icon>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.DialogItem dialogKey="update">
            <Icon>
              <Pencil2Icon />
            </Icon>
            Name ändern
          </DropdownMenu.DialogItem>
          <DropdownMenu.DialogItem
            dialogKey="delete"
            css={{ colorScheme: "danger" }}
          >
            <Icon css={{ marginTop: "2px" }}>
              <TrashIcon />
            </Icon>
            Projekt löschen
          </DropdownMenu.DialogItem>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Box>
  );
}
