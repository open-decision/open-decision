import * as React from "react";
import { DropdownMenu, Button, Icon } from "@open-decision/design-system";
import { DeleteTreeDialog } from "../Dialogs/DeleteTreeDialog";
import { UpdateTreeDialog } from "../Dialogs/UpdateTreeDialog";
import {
  DotsHorizontalIcon,
  Pencil2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { PublishItem } from "./PublishItem";
import { ArchiveItem } from "./ArchiveItem";
import { TGetTreeOutput } from "@open-decision/tree-api-specification";

export type TreeCardMenuProps = {
  tree: TGetTreeOutput;
};

export function TreeCardMenu({ tree }: TreeCardMenuProps) {
  const dropdownTriggerRef = React.useRef<HTMLButtonElement | null>(null);

  return (
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
        {/* FIXME published needs to be set properly when the tree supports it */}
        <PublishItem
          treeId={tree.uuid}
          published={tree.publishedTrees.length > 0}
        />
        <ArchiveItem treeId={tree.uuid} status={tree.status} />
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
  );
}
