import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import Head from "next/head";
import * as React from "react";
import { ResetPasswordCard } from "../../features/Auth/components/AuthCards/ResetPasswordCard";
import { getAuthLayout } from "../../features/Auth/components/AuthLayout";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const messages = await import(`@open-decision/translations`).then(
    (translations) => ({
      common: translations.de.common,
      resetPassword: translations.de.resetPassword,
    })
  );

  return {
    props: {
      messages,
      locale,
    },
  };
};

export default function ResetPassword(): JSX.Element {
  const t = useTranslations("resetPassword");
  return (
    <>
      <Head>
        <title>{t("pageTitle")}</title>
      </Head>
      <ResetPasswordCard />
    </>
  );
}

ResetPassword.getLayout = getAuthLayout;
