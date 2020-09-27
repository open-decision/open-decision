/** @jsx jsx */
import { jsx } from "theme-ui";
import { Logo } from "..";
import { Avatar, Link, Flex, Button } from "theme-ui";
import { useAuth } from "../../Features/Auth/useAuth";
import { FaUserCircle } from "react-icons/fa";
import { IconButton } from "@material-ui/core";
import { AuthButton } from "../../Features/Auth/AuthButton";
import { Link as RouterLink } from "react-router-dom";

export const Header = ({ className = "" }) => {
  const auth = useAuth();
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
      <Link
        variant="nav"
        as={RouterLink}
        // @ts-ignore
        to="/"
      >
        <Logo sx={{ flex: "1 1 60%" }} />
      </Link>
      <Flex
        sx={{
          flex: "1 1 20%",
          justifyContent: "flex-end",
        }}
      >
        <Link
          variant="nav"
          as={RouterLink}
          // @ts-ignore
          to="/builder"
          sx={{ marginX: 4 }}
        >
          Builder
        </Link>
        <Link
          variant="nav"
          as={RouterLink}
          // @ts-ignore
          to="/dashboard"
          sx={{ marginX: 4 }}
        >
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
        {!auth.user && <Button onClick={() => auth.signup({})}>SignUp</Button>}
        {auth.user ? (
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
