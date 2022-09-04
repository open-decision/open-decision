import * as React from "react";
import { ButtonProps, DropdownMenu, Icon } from "@open-decision/design-system";
import { PlusIcon, RocketIcon } from "@radix-ui/react-icons";
import { CreateTreeDialog } from "./components/Dialogs/CreateTreeDialog";
import { TreeImport } from "./TreeImport";
import { useTranslations } from "next-intl";

export function NewProjectDropdown(props: ButtonProps) {
  const t = useTranslations("common");
  const [open, setOpen] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <CreateTreeDialog
        open={alertOpen}
        setOpen={setAlertOpen}
        focusOnClose={() => ref.current?.focus()}
      />
      <DropdownMenu.Root open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger asChild>
          <DropdownMenu.Button {...props}>
            <Icon css={{ marginTop: "2px" }}>
              <RocketIcon />
            </Icon>
            {t("NewProjectDropdown.label")}
          </DropdownMenu.Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content hidden={alertOpen} align="end">
          <DropdownMenu.Item
            ref={ref}
            onSelect={(event) => {
              event.preventDefault();
              setAlertOpen(true);
            }}
            css={{ colorScheme: "success" }}
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
            <TreeImport css={{ fontWeight: 500 }} onDone={() => setOpen(false)}>
              {t("NewProjectDropdown.importProject.label")}
            </TreeImport>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
}
