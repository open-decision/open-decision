import { useAuthAPI } from "@open-decision/api-react-binding";
import { DropdownMenu, Icon } from "@open-decision/design-system";
import { ExitIcon, GearIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/router";
import { MenuButton } from "./MenuButton";

export function UserMenu() {
  const t = useTranslations();
  const router = useRouter();
  const { mutate: logout } = useAuthAPI().useLogoutMutation({
    onSuccess: () => router.push("auth/login"),
  });

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <MenuButton label={t("common.UserMenu.label")} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" sideOffset={15}>
        <DropdownMenu.Item asChild>
          <Link href="/settings#account">
            <Icon>
              <GearIcon />
            </Icon>
            {t("common.glossary.settings")}
          </Link>
        </DropdownMenu.Item>
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
