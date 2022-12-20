import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import Head from "next/head";
import NextLink from "next/link";
import { getAuthLayout } from "../features/Auth/components/AuthLayout";
import { linkClasses } from "@open-decision/design-system";
import {
  containerClasses,
  descriptionClasses,
  headerClasses,
  headingClasses,
} from "../features/Auth/components/AuthCards/AuthCard";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const messages = await import(`@open-decision/translations`).then(
    (translations) => ({
      common: translations.de.common,
      notFound: translations.de.notFound,
    })
  );

  return {
    props: {
      messages,
      locale,
    },
  };
};

export default function Page() {
  const t = useTranslations("notFound");

  return (
    <>
      <Head>
        <title>{t("pageTitle")}</title>
      </Head>
      <div className={containerClasses}>
        <header className={headerClasses}>
          <h2 className={headingClasses}>{t("title")}</h2>
          <p className={descriptionClasses}>{t("description")}</p>
        </header>
        <footer>
          <NextLink href="/" className={linkClasses()}>
            {t("backToHome")}
          </NextLink>
        </footer>
      </div>
    </>
  );
}

Page.getLayout = getAuthLayout;
