import {
  activeStyle,
  Box,
  Heading,
  Icon,
  intentStyle,
  Label,
  Stack,
  styled,
} from "@open-decision/design-system";
import { AvatarIcon } from "@radix-ui/react-icons";
import { BaseHeader, MainContent } from "components";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { ChangeEmail } from "../features/Settings/ChangeEmail";
import { ChangePassword } from "../features/Settings/ChangePassword";
import { DeleteAccount } from "../features/Settings/DeleteAccount";

const StyledMainContent = styled(MainContent, {
  display: "grid",
  gridTemplateColumns: "1fr 200px minmax(600px, 1fr) 1fr",
  gridTemplateRows: "max-content max-content 1fr",
  layer: "2",
  height: "100vh",
  columnGap: "$7",
});

const SideMenuLink = styled("a", Label, {
  position: "relative",
  padding: "$2 $3",
  borderRadius: "$md",
  textDecoration: "none",
  colorScheme: "primary",
  border: "2px solid transparent",

  ...activeStyle({
    backgroundColor: "$colorScheme2",
    borderColor: "$colorScheme6",
  }),

  ...intentStyle({
    backgroundColor: "$colorScheme3",
    focusColor: "$colorScheme7",
  }),
});

SideMenuLink.defaultProps = { size: "medium" };

export default function SettingsPage() {
  const router = useRouter();

  return (
    <StyledMainContent>
      <BaseHeader css={{ gridColumn: "1 / -1" }}>
        <Box css={{ flex: 1 }} />
      </BaseHeader>
      <Heading
        size="large"
        as="h1"
        css={{ gridColumn: "2 / 4", marginBlock: "$9 $7" }}
      >
        Einstellungen
      </Heading>
      <Stack css={{ gap: "$1", gridColumn: "2" }}>
        <Link href="#account" passHref>
          <SideMenuLink data-active={router.asPath.includes("account")}>
            <Icon css={{ fontSize: "1.5em" }}>
              <AvatarIcon />
            </Icon>
            Account
          </SideMenuLink>
        </Link>
      </Stack>
      <Stack css={{ gridColumn: 3 }}>
        <Stack
          css={{
            gap: "$3",
          }}
        >
          <ChangePassword />
          <ChangeEmail />
          <DeleteAccount />
        </Stack>
      </Stack>
    </StyledMainContent>
  );
}
