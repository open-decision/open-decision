import * as React from "react";
import {
  DropdownMenu,
  Icon,
  Text,
  Tooltip,
} from "@open-decision/design-system";
import { Pencil2Icon, DownloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { MenuButton } from "../Header/MenuButton";
import { DeleteTreeDialog } from "../../features/Dashboard/components/Dialogs/DeleteTreeDialog";
import { UpdateTreeDialog } from "../../features/Dashboard/components/Dialogs/UpdateTreeDialog";
import { useRouter } from "next/router";
import { ExportDialog } from "../../features/Builder/components/ExportDialog";
import { useTreeAPI } from "../../features/Data/useTreeAPI";
import { useTranslations } from "next-intl";
import { ArchiveItem } from "./ArchiveItem";
import { PublishItem } from "./PublishItem";
import { TGetTreeOutput } from "@open-decision/api-specification";

type Props = {
  className?: string;
  children?: React.ReactNode;
  tree: string | TGetTreeOutput;
};

export function ProjectMenu({ className, tree, children }: Props) {
  const t = useTranslations("common");
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const updateItemRef = React.useRef<HTMLDivElement>(null);
  const exportItemRef = React.useRef<HTMLDivElement>(null);
  const deleteItemRef = React.useRef<HTMLDivElement>(null);

  const [openDialog, setOpenDialog] = React.useState<
    "export" | "update" | "delete" | undefined
  >(undefined);

  const { data, isLoading, isError, error } = useTreeAPI().useTreeQuery(
    tree as string,
    {
      select: ({ data }) => ({
        name: data.name,
        isPublished: data.publishedTrees.length > 0,
        uuid: data.uuid,
        publishedTree: {
          uuid: data.publishedTrees[0]?.uuid,
        },
        status: data.status,
      }),
      enabled: typeof tree === "string",
      initialData:
        typeof tree === "object" ? { data: tree, status: 200 } : undefined,
    }
  );

  if (isLoading)
    return React.isValidElement(children) ? (
      children
    ) : (
      <Text className="min-w-max">Projekt lädt...</Text>
    );
  if (isError) throw error;

  const dialogs = {
    update: () => (
      <UpdateTreeDialog
        treeId={data.uuid}
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
        treeName={data.name}
        treeId={data.uuid}
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
        tree={data}
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
            <MenuButton label={data.name} className={className} />
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
            treeName={data.name}
            treeId={data.uuid}
            publishedTreeId={data.publishedTree.uuid}
          />
          <ArchiveItem treeId={data.uuid} status={data.status} />
          <Tooltip.Root open={!data.isPublished ? false : undefined}>
            <Tooltip.Trigger asChild>
              <DropdownMenu.Item
                onSelect={() => {
                  setOpenDialog("delete");
                  setDropdownOpen(false);
                }}
                ref={deleteItemRef}
                className="colorScheme-danger"
                disabled={data.isPublished}
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
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
}
