import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";
import { styled } from "@open-decision/design-system";
import Link from "next/link";
import { User } from "react-feather";

const Trigger = styled(DropdownMenu.Trigger, {});
const StyledAvatar = styled(Avatar.Root, {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  verticalAlign: "middle",
  overflow: "hidden",
  userSelect: "none",
  width: 48,
  height: 48,
  borderRadius: "$full",
});

const Item = styled(DropdownMenu.Item, {});

const Content = styled(DropdownMenu.Content, {
  display: "grid",
  gap: "$2",
  minWidth: 130,
  backgroundColor: "white",
  borderRadius: "$sm",
  padding: "$6 $8",
  boxShadow: "$xl",
  marginTop: "$2",
});

type UserMenuProps = { imgSrc?: string };

export const UserMenu: React.FC<UserMenuProps> = ({ imgSrc }) => {
  return (
    <DropdownMenu.Root>
      <Trigger>
        <StyledAvatar>
          <Avatar.Image src={imgSrc} />
          <Avatar.Fallback>
            <User className="w-full" />
          </Avatar.Fallback>
        </StyledAvatar>
      </Trigger>

      <Content>
        <Link href="./profile">
          <Item>Profil</Item>
        </Link>
        <Link href="./settings">
          <Item>Einstellungen</Item>
        </Link>
      </Content>
    </DropdownMenu.Root>
  );
};
