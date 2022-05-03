import { ButtonProps, DropdownMenu, Icon } from "@open-decision/design-system";
import { PlusIcon, RocketIcon } from "@radix-ui/react-icons";
import { CreateTreeDialog } from "./components/Dialogs/CreateTreeDialog";
import { TreeImport } from "./TreeImport";

export function NewProjectDropdown(props: ButtonProps) {
  return (
    <DropdownMenu.Root dialogs={{ create: <CreateTreeDialog /> }}>
      <DropdownMenu.Trigger asChild>
        <DropdownMenu.Button {...props}>
          <Icon css={{ marginTop: "2px" }}>
            <RocketIcon />
          </Icon>
          Projekt erstellen
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
          Neues Projekt erstellen
        </DropdownMenu.DialogItem>
        <DropdownMenu.Item>
          <TreeImport />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
