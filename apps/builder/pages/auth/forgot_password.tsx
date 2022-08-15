import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import Head from "next/head";
import * as React from "react";
import { ForgotPasswordCard } from "../../features/Auth/components/AuthCards";
import { getAuthLayout } from "../../features/Auth/components/AuthLayout";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const messages = await import(`@open-decision/translations`).then(
    (translations) => ({
      common: translations.de.common,
      forgotPassword: translations.de.forgotPassword,
    })
  );

  return {
    props: {
      messages,
      locale,
    },
  };
};

export default function ForgotPassword(): JSX.Element {
  const t = useTranslations("forgotPassword");

  return (
    <>
      <Head>
        <title>{t("pageTitle")}</title>
      </Head>
      <ForgotPasswordCard />
    </>
  );
}

ForgotPassword.getLayout = getAuthLayout;
