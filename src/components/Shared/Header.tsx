/** @jsx jsx */
import React from "react";
import { Heading, jsx, Avatar, Flex } from "theme-ui";
import { FaUserCircle } from "react-icons/fa";
import { IconButton } from "@material-ui/core";
import {
  LoginButton,
  LogoutButton,
  SignupButton,
  useAuthToken,
} from "../../Features";
import { Link } from "./InternalLink";
import { FunctionComponent } from "react";
import { GlobalProps } from "types/global";

const AuthButtons = ({ className }: { className?: string }) => {
  const [getToken] = useAuthToken();
  const token = getToken();

  return (
    <Flex sx={{ alignItems: "center" }} className={className}>
      {token ? (
        <React.Fragment>
          <LogoutButton sx={{ mr: 2 }} />
          <IconButton>
            <Avatar src="https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1400&q=80" />
          </IconButton>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <LoginButton sx={{ mr: 2 }} />
          <SignupButton sx={{ mr: 2 }} />
          <IconButton>
            <FaUserCircle size="48" />
          </IconButton>
        </React.Fragment>
      )}
    </Flex>
  );
};

export const Header: FunctionComponent<GlobalProps> = ({ className = "" }) => {
  //TODO handle signup failure in UI
  return (
    <Flex
      sx={{
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        paddingX: 6,
        paddingY: 3,
        bg: "grays.1",
      }}
      className={className}
    >
      <Link variant="nav" to="/">
        <Heading
          className={className}
          sx={{ color: "grays.4", fontSize: 5, flex: "1 1 60%" }}
        >
          open <span sx={{ color: "secondary" }}>decision</span>
        </Heading>
      </Link>
      <Flex
        sx={{
          flex: "1 1 20%",
          justifyContent: "flex-end",
        }}
      >
        <Link variant="nav" to="/builder" sx={{ marginX: 4 }}>
          Builder
        </Link>
        <Link variant="nav" to="/dashboard" sx={{ marginX: 4 }}>
          Dashboard
        </Link>
      </Flex>
      <AuthButtons />
    </Flex>
  );
};
