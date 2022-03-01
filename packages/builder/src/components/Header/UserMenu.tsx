import { DropdownMenu } from "@open-decision/design-system";
import { useAuth } from "features/Auth/useAuth";
import { MenuButton } from "./MenuButton";

export function UserMenu() {
  const [, send] = useAuth();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <MenuButton label="Mein Account" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item disabled>Profil (coming soon)</DropdownMenu.Item>
        <DropdownMenu.Item onSelect={() => send({ type: "LOG_OUT" })}>
          Logout
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
