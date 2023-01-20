import * as React from "react";
import {
  DropdownMenu,
  Icon,
  Separator,
  Tooltip,
} from "@open-decision/design-system";
import { Pencil2Icon, DownloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { MenuButton } from "../Header/MenuButton";
import { DeleteTreeDialog } from "./Dialogs/DeleteTreeDialog";
import { UpdateTreeDialog } from "./Dialogs/UpdateTreeDialog";
import { useRouter } from "next/router";
import { ExportDialog } from "../../features/Builder/components/ExportDialog";
import { useTranslations } from "next-intl";
import { ArchiveItem } from "./ArchiveItem";
import { PublishItem } from "./PublishItem";
import { TGetTreeOutput } from "@open-decision/api-specification";

type ItemRendererProps = {
  setDropdownOpen: (open: boolean) => void;
};

type Props = {
  className?: string;
  children?: React.ReactNode;
  Items?: (props: ItemRendererProps) => React.ReactNode;
  tree: TGetTreeOutput;
};

export function ProjectMenu({ className, children, Items, tree }: Props) {
  const t = useTranslations("common");
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const updateItemRef = React.useRef<HTMLDivElement>(null);
  const exportItemRef = React.useRef<HTMLDivElement>(null);
  const deleteItemRef = React.useRef<HTMLDivElement>(null);

  const [openDialog, setOpenDialog] = React.useState<
    "export" | "update" | "delete" | undefined
  >(undefined);

  const isPublished = tree.publishedTrees.length > 0;

  const dialogs = {
    update: () => (
      <UpdateTreeDialog
        treeId={tree.uuid}
        open={openDialog === "update"}
        onSuccess={() => {
          setOpenDialog(undefined);
          setDropdownOpen(false);
        }}
        onCancel={() => {
          setOpenDialog(undefined);
        }}
        focusOnCancel={() => updateItemRef.current?.focus()}
      />
    ),
    export: () => (
      <ExportDialog
        treeName={tree.name}
        treeId={tree.uuid}
        open={openDialog === "export"}
        onSuccess={() => {
          setOpenDialog(undefined);
          setDropdownOpen(false);
        }}
        onCancel={() => {
          setOpenDialog(undefined);
        }}
        focusOnCancel={() => exportItemRef.current?.focus()}
      />
    ),
    delete: () => (
      <DeleteTreeDialog
        tree={tree}
        onDelete={() => router.push("/")}
        open={openDialog === "delete"}
        onSuccess={() => {
          setOpenDialog(undefined);
          setDropdownOpen(false);
        }}
        onCancel={() => {
          setOpenDialog(undefined);
        }}
        focusOnCancel={() => deleteItemRef.current?.focus()}
      />
    ),
  };

  return (
    <>
      {openDialog ? dialogs[openDialog]?.() : null}
      <DropdownMenu.Root open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenu.Trigger asChild>
          {React.isValidElement(children) ? (
            children
          ) : (
            <MenuButton label={tree.name} className={className} />
          )}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content sideOffset={15} alignOffset={7} align="start">
          <DropdownMenu.Item
            onSelect={() => {
              setOpenDialog("update");
              setDropdownOpen(false);
            }}
            ref={updateItemRef}
          >
            <Icon>
              <Pencil2Icon />
            </Icon>
            {t("projectMenu.changeName")}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => {
              setOpenDialog("export");
              setDropdownOpen(false);
            }}
            ref={exportItemRef}
          >
            <Icon>
              <DownloadIcon />
            </Icon>
            {t("projectMenu.export")}
          </DropdownMenu.Item>
          <PublishItem
            treeName={tree.name}
            treeId={tree.uuid}
            publishedTreeId={tree.publishedTrees[0]?.uuid}
          />
          <ArchiveItem treeId={tree.uuid} status={tree.status} />
          <Tooltip.Root open={!isPublished ? false : undefined}>
            <Tooltip.Trigger asChild>
              <DropdownMenu.Item
                onSelect={() => {
                  setOpenDialog("delete");
                  setDropdownOpen(false);
                }}
                ref={deleteItemRef}
                className="colorScheme-danger"
                disabled={isPublished}
              >
                <Icon className="mt-[2px]">
                  <TrashIcon />
                </Icon>
                {t("projectMenu.delete")}
              </DropdownMenu.Item>
            </Tooltip.Trigger>
            <Tooltip.Content side="bottom">
              {t("projectMenu.disabledDeletePublishedTreeTooltip")}
            </Tooltip.Content>
          </Tooltip.Root>
          {Items ? (
            <>
              <Separator />
              {Items?.({ setDropdownOpen })}
            </>
          ) : null}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
}
