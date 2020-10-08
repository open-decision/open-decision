/** @jsx jsx */
import { Heading, jsx } from "theme-ui";
import { Avatar, Flex } from "theme-ui";
import { FaUserCircle } from "react-icons/fa";
import { IconButton } from "@material-ui/core";
import { AuthButton, SignupButton, useAuthToken } from "../../Features";
import { Link } from "./InternalLink";
import { FunctionComponent } from "react";

interface Props {
  className?: string;
}

export const Header: FunctionComponent<Props> = ({ className = "" }) => {
  const { token } = useAuthToken();
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
      <Flex
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          flexBasis: "max-content",
        }}
      >
        <AuthButton sx={{ marginX: 3 }} />
        {!token && <SignupButton />}
        {token ? (
          <IconButton>
            <Avatar src="https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1400&q=80" />
          </IconButton>
        ) : (
          <IconButton>
            <FaUserCircle size="48" />
          </IconButton>
        )}
      </Flex>
    </Flex>
  );
};
