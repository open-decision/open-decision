import { DropdownMenu, StyleObject } from "@open-decision/design-system";
import { Logo } from "components";
import { MenuButton } from "components/Header/MenuButton";

type Props = { css?: StyleObject };

export function ProjectMenu({ css }: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <MenuButton
          label={<Logo css={{ width: "40px", height: "40px" }} />}
          css={css}
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content></DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
