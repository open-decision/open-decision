import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";
import { UserCircleOutline } from "@graywolfai/react-heroicons";
import { styled } from "utils/stitches.config";
import { Button } from "./Button";
import { authService } from "features";
import { useService } from "@xstate/react";
import Link from "next/link";

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
  const [state, send] = useService(authService);

  return (
    <DropdownMenu.Root>
      <Trigger>
        <StyledAvatar>
          <Avatar.Image src={imgSrc} />
          <Avatar.Fallback>
            <UserCircleOutline className="w-full" />
          </Avatar.Fallback>
        </StyledAvatar>
      </Trigger>

      <Content>
        {/* @ts-expect-error: stitches error */}
        <Item as={Link} href="./profile">
          Profil
        </Item>
        {/* @ts-expect-error: stitches error */}
        <Item as={Link} href="./settings">
          Einstellungen
        </Item>
        {state.matches("loggedIn") && (
          <Button onClick={() => send("Logout")}>Logout</Button>
        )}
      </Content>
    </DropdownMenu.Root>
  );
};
