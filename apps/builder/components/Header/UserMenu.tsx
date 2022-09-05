import {
  DropdownMenu,
  Icon,
  Link as SystemLink,
} from "@open-decision/design-system";
import { ExitIcon, GearIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLogoutMutation } from "../../features/Auth/mutations/useLogoutMutation";
import { MenuButton } from "./MenuButton";

export function UserMenu() {
  const t = useTranslations();
  const { mutate: logout } = useLogoutMutation();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <MenuButton label={t("common.UserMenu.label")} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" sideOffset={15}>
        <Link href="/settings#account" passHref>
          <DropdownMenu.Item asChild>
            <SystemLink>
              <Icon>
                <GearIcon />
              </Icon>
              {t("common.glossary.settings")}
            </SystemLink>
          </DropdownMenu.Item>
        </Link>
        <DropdownMenu.Item onSelect={() => logout()}>
          <Icon>
            <ExitIcon />
          </Icon>
          {t("common.glossary.logout")}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
