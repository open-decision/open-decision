import { ErrorCard, Stack } from "@open-decision/design-system";
import { ErrorBoundary } from "@sentry/nextjs";
import { BaseHeader } from "../components";
import * as React from "react";
import { getDashboardLayout } from "../features/Dashboard/DashboardLayout";
import Head from "next/head";
import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import TreeList from "../features/Dashboard/TreeList";
import { convertToODError } from "@open-decision/type-classes";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const messages = await import(`@open-decision/translations`).then(
    (translations) => ({
      common: translations.de.common,
      dashboard: translations.de.dashboard,
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

export default function DashboardPage() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t("dashboard.pageTitle")}</title>
      </Head>
      <BaseHeader css={{ gridColumn: "1 / -1" }} />
      <ErrorBoundary
        fallback={({ error }) => (
          <Stack center css={{ gridColumn: "2 / 4", gridRow: "2 / 4" }}>
            <ErrorCard error={convertToODError(error)} />
          </Stack>
        )}
      >
        <Stack
          css={{
            gridColumn: "2 / 4",
            gridRow: "2 / 4",
          }}
        >
          <TreeList />
        </Stack>
      </ErrorBoundary>
    </>
  );
}

DashboardPage.getLayout = getDashboardLayout;
