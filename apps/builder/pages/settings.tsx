import {
  Heading,
  Icon,
  Label,
  Stack,
  styled,
  activeSelector,
  intentSelector,
} from "@open-decision/design-system";
import { AvatarIcon } from "@radix-ui/react-icons";
import { BaseHeader } from "../components";
import Link from "next/link";
import * as React from "react";
import { getDashboardLayout } from "../features/Dashboard/DashboardLayout";
import { TGetUserOutput } from "@open-decision/user-api-specification";
import { ChangeEmail } from "../features/Settings/ChangeEmail";
import { ChangePassword } from "../features/Settings/ChangePassword";
import { DeleteAccount } from "../features/Settings/DeleteAccount";
import { GetServerSidePropsContext } from "next";
import { client } from "@open-decision/api-client";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const OD = client({
    token: context.req.cookies["token"],
    urlPrefix: `${process.env.NEXT_PUBLIC_OD_API_ENDPOINT}/v1`,
  });

  const user = await OD.user.getUser({});

  return { props: { user: user.data } };
};

const SideMenuLink = styled("a", Label, {
  position: "relative",
  padding: "$2 $3",
  borderRadius: "$md",
  textDecoration: "none",
  colorScheme: "primary",
  border: "2px solid transparent",

  [`${activeSelector}`]: {
    backgroundColor: "$colorScheme2",
    borderColor: "$colorScheme6",
  },

  [`${intentSelector}`]: {
    backgroundColor: "$colorScheme3",
    focusColor: "$colorScheme7",
  },
});

SideMenuLink.defaultProps = { size: "medium" };

type PageProps = { user: TGetUserOutput };

export default function SettingsPage({ user }: PageProps) {
  return (
    <>
      <BaseHeader css={{ gridColumn: "1 / -1" }} />
      <Heading
        size="large"
        as="h1"
        css={{ gridColumn: "2 / 4", marginBlock: "$9 $7" }}
      >
        Einstellungen
      </Heading>
      <Stack css={{ gap: "$1", gridColumn: "2" }}>
        <Link href="#account" passHref>
          <SideMenuLink data-active>
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
          <ChangePassword user={user} />
          <ChangeEmail user={user} />
          <DeleteAccount user={user} />
        </Stack>
      </Stack>
    </>
  );
}

SettingsPage.getLayout = getDashboardLayout;
