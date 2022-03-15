import { DropdownMenu } from "@open-decision/design-system";
import { useAuth } from "features/Auth/useAuth";
import Link from "next/link";
import { MenuButton } from "./MenuButton";

export function UserMenu() {
  const [, send] = useAuth();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <MenuButton label="Mein Account" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <Link href="settings">
          <DropdownMenu.Item>Einstellungen</DropdownMenu.Item>
        </Link>
        <DropdownMenu.Item onSelect={() => send({ type: "LOG_OUT" })}>
          Logout
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
