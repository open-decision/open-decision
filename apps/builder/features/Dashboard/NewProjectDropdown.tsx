import * as React from "react";
import { ButtonProps, DropdownMenu, Icon } from "@open-decision/design-system";
import { PlusIcon, RocketIcon } from "@radix-ui/react-icons";
import { CreateTreeDialog } from "../../components/ProjectMenu/Dialogs/CreateTreeDialog";
import { TreeImport } from "./TreeImport";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

export function NewProjectDropdown(props: ButtonProps) {
  const t = useTranslations("common");
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const dialog = (
    <CreateTreeDialog
      open={dialogOpen}
      onCreate={({ data: { uuid } }) => {
        router.push(`/builder/${uuid}`);
      }}
      onSuccess={() => {
        setDropdownOpen(false);
        setDialogOpen(false);
      }}
      onCancel={() => {
        setDialogOpen(false);
      }}
      focusOnCancel={() => ref.current?.focus()}
    />
  );

  return (
    <>
      {dialogOpen && dialog}
      <DropdownMenu.Root open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenu.Trigger asChild>
          <DropdownMenu.Button className="gap-2" {...props}>
            <Icon>
              <RocketIcon />
            </Icon>
            {t("NewProjectDropdown.label")}
          </DropdownMenu.Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content hidden={dialogOpen} align="end">
          <DropdownMenu.Item
            ref={ref}
            onSelect={() => {
              setDialogOpen(true);
              setDropdownOpen(false);
            }}
            className="colorScheme-success"
          >
            <Icon>
              <PlusIcon />
            </Icon>
            {t("NewProjectDropdown.createProjectLabel")}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            asChild
            // Disable closing the dropdown, because that unmounts the input the import file picker
            // is for.
            onSelect={(event) => {
              event.preventDefault();
            }}
          >
            <TreeImport
              className="font-[500]"
              onDone={() => setDropdownOpen(false)}
            >
              {t("NewProjectDropdown.importProject.label")}
            </TreeImport>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
}
