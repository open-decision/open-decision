import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";
import { UserCircleOutline } from "@graywolfai/react-heroicons";
import { styled } from "utils/stitches.config";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import { authService } from "features/Data/authStateMachine";
import { useService } from "@xstate/react";

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
        <Item as={Link} to="./profile">
          Profil
        </Item>
        <Item as={Link} to="./settings">
          Einstellungen
        </Item>
        {state.matches("loggedIn") && (
          <Button onClick={() => send("Logout")}>Logout</Button>
        )}
      </Content>
    </DropdownMenu.Root>
  );
};
