import {
  Heading,
  Icon,
  Stack,
  LoadingSpinner,
  labelClasses,
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
import { useTranslations } from "next-intl";
import { useUser } from "@open-decision/api-react-binding";
import { APIClient } from "@open-decision/api-client";

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

export default function SettingsPage() {
  const t = useTranslations("settings");
  const {
    data: user,
    isLoading,
    isSuccess,
  } = useUser(APIClient).useUserQuery();

  if (isLoading) {
    return (
      <Stack center className="col-span-full row-span-full">
        <LoadingSpinner />
      </Stack>
    );
  }

  if (isSuccess) {
    return (
      <>
        <Head>
          <title>{t("pageTitle")}</title>
        </Head>
        <BaseHeader className="col-span-full" />
        <Heading size="large" as="h1" className="col-[2/4] mt-9 mb-7">
          {t("title")}
        </Heading>
        <Stack className="gap-1 col-[2]">
          <Link
            className={labelClasses(
              { size: "medium" },
              "relative px-2 py-3 rounded-md no-underline colorScheme-primary border-2 border-transparent active:bg-colorScheme2 active:border-colorScheme6 intent:bg-colorScheme3 intent:border-colorScheme7"
            )}
            href="#account"
            data-active
          >
            <Icon>
              <AvatarIcon />
            </Icon>
            {t("account.title")}
          </Link>
        </Stack>
        <Stack className="col-[3]">
          <Stack className="gap-3">
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
