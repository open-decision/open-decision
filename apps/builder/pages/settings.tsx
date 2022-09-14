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
import { GetStaticProps } from "next";
import Head from "next/head";
import { useUser } from "../features/Auth/useUserQuery";
import { useTranslations } from "next-intl";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const messages = await import(`@open-decision/translations`).then(
    (translations) => ({
      common: translations.de.common,
      settings: translations.de.settings,
    })
  );

  return {
    props: {
      messages,
      locale,
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
