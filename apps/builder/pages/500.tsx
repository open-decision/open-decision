import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import Head from "next/head";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const messages = await import(`@open-decision/translations`).then(
    (translations) => ({
      common: translations.de.common,
      error: translations.de.error,
    })
  );

  return {
    props: {
      messages,
      locale,
    },
  };
};

export default function Custom500() {
  const t = useTranslations("notFound");

  return (
    <>
      <Head>
        <title>{t("pageTitle")}</title>
      </Head>
      <h1>500 - Server-side error occurred</h1>;
    </>
  );
}
