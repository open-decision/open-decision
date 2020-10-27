/** @jsx jsx */
import React from "react";
import { Heading, Avatar, jsx, Flex, IconButton, Box } from "theme-ui";
import { FaUserCircle } from "react-icons/fa";
import {
  LoginButton,
  LogoutButton,
  SignupButton,
  useAuthToken,
} from "@features/index";
import { InternalLink } from "./InternalLink";
import { FunctionComponent } from "react";
import { GlobalProps } from "@internalTypes/global";
import { useBreakpointIndex } from "@theme-ui/match-media";
import { DropdownMenu, Menu, MenuItem } from "./Menu";

const UserIcon = new URL("/assets/icons/account_circle.svg", import.meta.url);

type AuthButtonsProps = {
  collapse: boolean;
};

const AuthButtons: FunctionComponent<GlobalProps & AuthButtonsProps> = ({
  className,
  collapse,
}) => {
  const [getToken] = useAuthToken();
  const token = getToken();

  return (
    <Flex
      sx={{ alignItems: "center", justifyContent: "space-between" }}
      className={className}
    >
      {token ? (
        <>
          {/* {collapse ? null : <LogoutButton sx={{ mr: 4 }} />} */}
          <IconButton>
            <Avatar src="https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=50&q=80" />
          </IconButton>
          <Menu open={true} />
        </>
      ) : (
        <>
          {/* {collapse ? null : (
            <>
              <LoginButton sx={{ mr: 2 }} />
              <SignupButton sx={{ mr: 4 }} />
            </>
          )} */}
          <Menu open={true}>
            <IconButton sx={{ width: [35, 50], height: [35, 50] }}>
              <FaUserCircle size="auto" />
            </IconButton>
          </Menu>
        </>
      )}
    </Flex>
  );
};

export const Header: FunctionComponent<GlobalProps> = ({ className }) => {
  const index = useBreakpointIndex();
  console.log(index);

  //TODO handle signup failure in UI
  return (
    <Flex
      sx={{
        bg: "grays.1",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        px: [4, 6],
        py: 3,
      }}
      className={className}
    >
      <Flex
        sx={{
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          flexGrow: 1,
        }}
      >
        <InternalLink
          variant="nav"
          to="/"
          sx={{ flexGrow: 1, mr: 5, minWidth: "max-content" }}
        >
          <Heading
            className={className}
            sx={{ color: "grays.4", fontSize: [3, 5] }}
          >
            open <span sx={{ color: "secondary" }}>decision</span>
          </Heading>
        </InternalLink>
        <Menu open={true}>
          <MenuItem icon={UserIcon.href} iconSize={35}>
            <DropdownMenu />
          </MenuItem>
          {/* <InternalLink variant="nav" to="/builder" sx={{ mr: 5, py: 3 }}>
            Builder
          </InternalLink>
          <InternalLink variant="nav" to="/dashboard" sx={{ mr: 5, py: 3 }}>
            Dashboard
          </InternalLink> */}
        </Menu>
        {/* <Flex sx={{ minWidth: "max-content" }}>
          <InternalLink variant="nav" to="/builder" sx={{ mr: 5, py: 3 }}>
            Builder
          </InternalLink>
          <InternalLink variant="nav" to="/dashboard" sx={{ mr: 5, py: 3 }}>
            Dashboard
          </InternalLink>
        </Flex>
      <AuthButtons sx={{ minWidth: "max-content" }} collapse={index <= 1} /> */}
      </Flex>
    </Flex>
  );
};
