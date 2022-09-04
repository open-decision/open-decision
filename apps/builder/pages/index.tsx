import { LoadingSpinner, Stack } from "@open-decision/design-system";
import { ErrorBoundary } from "@sentry/nextjs";
import { BaseHeader } from "../components";
// import { TreeList } from "../features/Dashboard/TreeList";
import * as React from "react";
import { ErrorCard } from "../components/Error/ErrorCard";
import { getDashboardLayout } from "../features/Dashboard/DashboardLayout";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { useTranslations } from "next-intl";
import { client } from "@open-decision/api-client";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { treesQueryKey } from "../features/Data/useTreeAPI";
import TreeList from "../features/Dashboard/TreeList";
import { safeFetch } from "@open-decision/api-helpers";
import { convertToODError } from "@open-decision/type-classes";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  locale,
}) => {
  const messages = await import(`@open-decision/translations`).then(
    (translations) => ({
      common: translations.de.common,
      dashboard: translations.de.dashboard,
    })
  );

  const OD = client({
    token: req.cookies["token"],
    urlPrefix: `${process.env.NEXT_PUBLIC_OD_API_ENDPOINT}/v1`,
    fetchFunction: safeFetch,
  });
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(treesQueryKey, () =>
    OD.trees.getCollection()
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
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
          <React.Suspense
            fallback={
              <LoadingSpinner
                size="50px"
                css={{ flex: 1, alignSelf: "center" }}
              />
            }
          >
            <TreeList />
          </React.Suspense>
        </Stack>
      </ErrorBoundary>
    </>
  );
}

DashboardPage.getLayout = getDashboardLayout;
