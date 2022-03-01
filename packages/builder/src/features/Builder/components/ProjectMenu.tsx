import {
  DropdownMenu,
  Icon,
  Link as SystemLink,
  StyleObject,
} from "@open-decision/design-system";
import { MenuButton } from "components/Header/MenuButton";
import Link from "next/link";
import { ChevronLeft } from "react-feather";

type Props = { css?: StyleObject };

export function ProjectMenu({ css }: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <MenuButton label="Projekt" css={css} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <Link passHref href="/">
          <DropdownMenu.Item asChild>
            <SystemLink underline={false}>
              <Icon>
                <ChevronLeft />
              </Icon>
              Zurück zum Dashboard
            </SystemLink>
          </DropdownMenu.Item>
        </Link>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
