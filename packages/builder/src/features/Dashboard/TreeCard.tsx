import * as React from "react";
import {
  Button,
  DropdownMenu,
  focusStyle,
  Heading,
  Icon,
  Stack,
  styled,
  Text,
} from "@open-decision/design-system";
import { formatRelative, parseISO } from "date-fns";
import de from "date-fns/locale/de";
import { TreesQuery } from "features/Data/generated/graphql";
import { DeleteTreeDialog } from "./components/Dialogs/DeleteTreeDialog";
import Link from "next/link";
import { UpdateTreeDialog } from "./components/Dialogs/UpdateTreeDialog";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

const Card = styled("a", Stack, {
  position: "relative",
  padding: "$5",
  border: "1px solid $gray7",
  borderRadius: "$md",
  layer: "1",
  transition: "all 0.2s ease-in-out",
  textDecoration: "none",

  ...focusStyle({
    transform: "scale(1.02)",
    boxShadow: "$3",
  }),
});

type Props = { tree: TreesQuery["decisionTrees"][0] };

export function TreeCard({ tree }: Props) {
  const [openDialog, setOpenDialog] = React.useState<"update" | "delete" | "">(
    ""
  );

  const dropdownTriggerRef = React.useRef<HTMLButtonElement | null>(null);

  const Dialog = React.useCallback(
    function Dialog() {
      switch (openDialog) {
        case "update":
          return (
            <UpdateTreeDialog
              open={true}
              setOpen={() => setOpenDialog("")}
              treeId={tree.uuid}
              focusOnClose={() => dropdownTriggerRef.current?.focus()}
            />
          );
        case "delete":
          return (
            <DeleteTreeDialog
              open={true}
              setOpen={() => setOpenDialog("")}
              tree={tree}
              focusOnClose={() => dropdownTriggerRef.current?.focus()}
            />
          );
        case "":
          return null;
      }
    },
    [openDialog, tree]
  );

  return (
    <>
      <Dialog />
      <Link href={`/builder/${tree.uuid}`} passHref>
        <Card
          css={{ cursor: "pointer" }}
          title={`Öffne das Projekt ${tree.name}`}
        >
          <Heading size="small" css={{ marginBottom: "$1" }}>
            {tree.name}
          </Heading>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild ref={dropdownTriggerRef}>
              <Button
                variant="ghost"
                square
                css={{ position: "absolute", right: 20, top: 12 }}
              >
                <Icon label={`Projektmenü ${tree.name}`}>
                  <HamburgerMenuIcon />
                </Icon>
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item
                onClick={(event) => event.stopPropagation()}
                onSelect={() => setOpenDialog("update")}
              >
                Projektname ändern
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={(event) => event.stopPropagation()}
                onSelect={() => setOpenDialog("delete")}
              >
                Projekt löschen
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <Text css={{ color: "$gray11" }}>
            {formatRelative(parseISO(tree.updatedAt), new Date(), {
              locale: de,
            })}
          </Text>
          {/* <TreeTags tags={tree.tags} /> */}
        </Card>
      </Link>
    </>
  );
}
