import * as React from "react";
import {
  DropdownMenu,
  Button,
  Icon,
  Tooltip,
} from "@open-decision/design-system";
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

  const isPublished = tree.publishedTrees.length > 0;

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
            tree={{ name: tree.name, uuid: tree.uuid }}
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
        <PublishItem
          treeName={tree.name}
          treeId={tree.uuid}
          publishedTreeId={tree.publishedTrees[0]?.uuid}
        />
        <ArchiveItem treeId={tree.uuid} status={tree.status} />
        <Tooltip.Root>
          <Tooltip.Trigger disabled={!isPublished} asChild>
            <DropdownMenu.DialogItem
              dialogKey="delete"
              css={{ colorScheme: "danger" }}
              disabled={isPublished}
            >
              <Icon css={{ marginTop: "2px" }}>
                <TrashIcon />
              </Icon>
              Projekt löschen
            </DropdownMenu.DialogItem>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Tooltip.Title>
              Ein veröffentlichter Baum kann nicht gelöscht werden. Bitte
              unveröffentliche den Baum erst.
            </Tooltip.Title>
          </Tooltip.Content>
        </Tooltip.Root>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
