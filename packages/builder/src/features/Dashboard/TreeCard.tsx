import * as React from "react";
import {
  Button,
  DropdownMenu,
  Heading,
  Icon,
  Stack,
  styled,
  Text,
} from "@open-legal-tech/design-system";
import { formatRelative, parseISO } from "date-fns";
import de from "date-fns/locale/de";
import { TreesQuery } from "features/Data/generated/graphql";
import { MoreHorizontal } from "react-feather";
import { DeleteTreeDialog } from "./components/Dialogs/DeleteTreeDialog";
import { TreeTags } from "./TreeTags";
import { UpdateTreeDialog } from "./components/Dialogs/UpdateTreeDialog";
import Link from "next/link";

const Card = styled(Stack, {
  padding: "$5",
  border: "1px solid $gray7",
  borderRadius: "$md",
  backgroundColor: "white",
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
              treeId={tree.id}
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
      <Link href={`/builder/${tree.id}`}>
        <Card css={{ cursor: "pointer" }}>
          <Stack
            css={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBlock: "-$3",
            }}
          >
            <Heading size="small">{tree.name}</Heading>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild ref={dropdownTriggerRef}>
                <Button variant="ghost" square>
                  <Icon label="Projektmenü">
                    <MoreHorizontal />
                  </Icon>
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item
                  onClick={(event) => event.stopPropagation()}
                  onSelect={() => setOpenDialog("update")}
                >
                  Name ändern
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={(event) => event.stopPropagation()}
                  onSelect={() => setOpenDialog("delete")}
                >
                  Löschen
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Stack>
          <Text css={{ color: "$gray11", marginTop: "$2" }}>
            {formatRelative(parseISO(tree.updatedAt), new Date(), {
              locale: de,
            })}
          </Text>
          <TreeTags tags={tree.tags} />
        </Card>
      </Link>
    </>
  );
}
