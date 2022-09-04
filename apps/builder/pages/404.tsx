import { Link } from "@open-decision/design-system";
import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { AuthCard } from "../features/Auth/components/AuthCards";
import NextLink from "next/link";
import { getAuthLayout } from "../features/Auth/components/AuthLayout";

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
      <AuthCard.Container>
        <AuthCard.Header>
          <AuthCard.Heading>{t("title")}</AuthCard.Heading>
          <AuthCard.Description>{t("description")}</AuthCard.Description>
        </AuthCard.Header>
        <AuthCard.Footer>
          <NextLink passHref href="/">
            <Link>{t("backToHome")}</Link>
          </NextLink>
        </AuthCard.Footer>
      </AuthCard.Container>
    </>
  );
}

Page.getLayout = getAuthLayout;
