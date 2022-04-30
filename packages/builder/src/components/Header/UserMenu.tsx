import {
  darkTheme,
  DropdownMenu,
  Icon,
  Link as SystemLink,
} from "@open-decision/design-system";
import { ExitIcon, GearIcon, HomeIcon } from "@radix-ui/react-icons";
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
        <Link href="/" passHref>
          <SystemLink>
            <DropdownMenu.Item>
              <Icon>
                <HomeIcon />
              </Icon>
              Dashboard
            </DropdownMenu.Item>
          </SystemLink>
        </Link>
        <Link href="/settings#account" passHref>
          <SystemLink>
            <DropdownMenu.Item>
              <Icon>
                <GearIcon />
              </Icon>
              Einstellungen
            </DropdownMenu.Item>
          </SystemLink>
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
