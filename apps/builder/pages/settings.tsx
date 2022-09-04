import {
  Heading,
  Icon,
  Label,
  Stack,
  styled,
  activeSelector,
  intentSelector,
  LoadingSpinner,
} from "@open-decision/design-system";
import { AvatarIcon } from "@radix-ui/react-icons";
import { BaseHeader } from "../components";
import Link from "next/link";
import * as React from "react";
import { getDashboardLayout } from "../features/Dashboard/DashboardLayout";
import { ChangeEmail } from "../features/Settings/ChangeEmail";
import { ChangePassword } from "../features/Settings/ChangePassword";
import { DeleteAccount } from "../features/Settings/DeleteAccount";
import { GetServerSidePropsContext } from "next";
import { client } from "@open-decision/api-client";
import Head from "next/head";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { useUser } from "../features/Auth/useUserQuery";
import { useTranslations } from "next-intl";
import { safeFetch } from "@open-decision/api-helpers";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const messages = await import(`@open-decision/translations`).then(
    (translations) => ({
      common: translations.de.common,
      settings: translations.de.settings,
    })
  );

  const OD = client({
    token: context.req.cookies["token"],
    urlPrefix: `${process.env["NEXT_PUBLIC_OD_API_ENDPOINT"]}/v1`,
    fetchFunction: safeFetch,
  });
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["user"], () => OD.user.getUser({}));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      messages,
      locale: context.locale,
      now: new Date().toISOString(),
    },
  };
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

export default function SettingsPage() {
  const t = useTranslations("settings");
  const { data: user, isLoading, isSuccess } = useUser().useUserQuery();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isSuccess) {
    return (
      <>
        <Head>
          <title>{t("pageTitle")}</title>
        </Head>
        <BaseHeader css={{ gridColumn: "1 / -1" }} />
        <Heading
          size="large"
          as="h1"
          css={{ gridColumn: "2 / 4", marginBlock: "$9 $7" }}
        >
          {t("title")}
        </Heading>
        <Stack css={{ gap: "$1", gridColumn: "2" }}>
          <Link href="#account" passHref>
            <SideMenuLink data-active>
              <Icon css={{ fontSize: "1.5em" }}>
                <AvatarIcon />
              </Icon>
              {t("account.title")}
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

  throw new Error("The user could not be found");
}

SettingsPage.getLayout = getDashboardLayout;
