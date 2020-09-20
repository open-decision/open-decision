import { Logo } from "../";
import { Avatar, Button, Flex } from "theme-ui";
import { useAuth } from "../../Hooks/useAuth";
import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { IconButton } from "@material-ui/core";

export const Header = ({ className = "" }) => {
  const auth = useAuth();

  return (
    <Flex
      sx={{
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        paddingX: 6,
        paddingY: 3,
      }}
      className={className}
    >
      <Logo sx={{ flex: "1" }} />
      <Flex
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          flexBasis: "max-content",
        }}
      >
        {auth.user ? (
          <>
            <Button onClick={() => auth.signout()} sx={{ mr: "1rem" }}>
              Logout
            </Button>
            <IconButton>
              <Avatar src="https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1400&q=80" />
            </IconButton>
          </>
        ) : (
          <>
            <Button onClick={() => auth.signin()} sx={{ mr: "1rem" }}>
              Login
            </Button>
            <IconButton>
              <FaUserCircle size="48" />
            </IconButton>
          </>
        )}
      </Flex>
    </Flex>
  );
};
