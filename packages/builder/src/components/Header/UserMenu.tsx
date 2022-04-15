import { darkTheme, DropdownMenu, Icon } from "@open-decision/design-system";
import { ExitIcon, GearIcon } from "@radix-ui/react-icons";
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
      <DropdownMenu.Content
        sideOffset={15}
        alignOffset={4}
        className={darkTheme}
        css={{ groupColor: "$gray12" }}
      >
        <Link href="/settings">
          <DropdownMenu.Item>
            <Icon>
              <GearIcon />
            </Icon>
            Einstellungen
          </DropdownMenu.Item>
        </Link>
        <DropdownMenu.Item onSelect={() => send({ type: "LOG_OUT" })}>
          <Icon>
            <ExitIcon />
          </Icon>
          Logout
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
