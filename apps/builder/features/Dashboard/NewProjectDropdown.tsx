import * as React from "react";
import { ButtonProps, DropdownMenu, Icon } from "@open-decision/design-system";
import { PlusIcon, RocketIcon } from "@radix-ui/react-icons";
import { CreateTreeDialog } from "./components/Dialogs/CreateTreeDialog";
import { TreeImport } from "./TreeImport";
import { useTranslations } from "next-intl";

export function NewProjectDropdown(props: ButtonProps) {
  const t = useTranslations("common");
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu.Root
      dialogs={{ create: <CreateTreeDialog /> }}
      open={open}
      onOpenChange={setOpen}
    >
      <DropdownMenu.Trigger asChild>
        <DropdownMenu.Button {...props}>
          <Icon css={{ marginTop: "2px" }}>
            <RocketIcon />
          </Icon>
          {t("NewProjectDropdown.label")}
        </DropdownMenu.Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.DialogItem
          dialogKey="create"
          css={{ colorScheme: "success" }}
        >
          <Icon>
            <PlusIcon />
          </Icon>
          {t("NewProjectDropdown.createProjectLabel")}
        </DropdownMenu.DialogItem>
        <DropdownMenu.Item
          asChild
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
  );
}
