import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import Head from "next/head";
import * as React from "react";
import { LoginCard } from "../../features/Auth/components/AuthCards";
import { getAuthLayout } from "../../features/Auth/components/AuthLayout";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const messages = await import(`@open-decision/translations`).then(
    (translations) => ({
      common: translations.de.common,
      login: translations.de.login,
    })
  );

  return {
    props: {
      messages,
      locale,
    },
  };
};

export default function Login(): JSX.Element {
  const t = useTranslations();
  return (
    <>
      <Head>
        <title>{t("login.pageTitle")}</title>
      </Head>
      <LoginCard />
    </>
  );
}

Login.getLayout = getAuthLayout;
