import {
  darkTheme,
  DropdownMenu,
  Icon,
  Link as SystemLink,
} from "@open-decision/design-system";
import { ExitIcon, GearIcon, HomeIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useLogoutMutation } from "../../features/Auth/mutations/useLogoutMutation";
import { MenuButton } from "./MenuButton";

export function UserMenu() {
  const { mutate: logout } = useLogoutMutation();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <MenuButton label="Mein Account" data-test="user-menu" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        sideOffset={15}
        alignOffset={4}
        className={darkTheme}
        css={{ groupColor: "$gray12" }}
      >
        <Link href="/" passHref>
          <DropdownMenu.Item asChild>
            <SystemLink>
              <Icon>
                <HomeIcon />
              </Icon>
              Dashboard
            </SystemLink>
          </DropdownMenu.Item>
        </Link>
        <Link href="/settings#account" passHref>
          <DropdownMenu.Item asChild>
            <SystemLink>
              <Icon>
                <GearIcon />
              </Icon>
              Einstellungen
            </SystemLink>
          </DropdownMenu.Item>
        </Link>
        <DropdownMenu.Item onSelect={() => logout()} data-test="logout">
          <Icon>
            <ExitIcon />
          </Icon>
          Logout
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
