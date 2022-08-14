import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import Head from "next/head";
import * as React from "react";
import { RegisterCard } from "../../features/Auth/components/AuthCards";
import { getAuthLayout } from "../../features/Auth/components/AuthLayout";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const messages = await import(`@open-decision/translations`).then(
    (translations) => ({
      common: translations.de.common,
      register: translations.de.register,
    })
  );

  return {
    props: {
      messages,
      locale,
    },
  };
};

export default function Register(): JSX.Element {
  const t = useTranslations("register");

  return (
    <>
      <Head>
        <title>{t("pageTitle")}</title>
      </Head>
      <RegisterCard />
    </>
  );
}

Register.getLayout = getAuthLayout;
