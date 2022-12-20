import { Stack } from "@open-decision/design-system";
import { BaseHeader } from "../components";
import * as React from "react";
import { getDashboardLayout } from "../features/Dashboard/DashboardLayout";
import Head from "next/head";
import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import TreeList from "../features/Dashboard/TreeList";

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
      <BaseHeader className="col-span-full" />
      <Stack className="col-[2/4] row-[2/4]">
        <TreeList />
      </Stack>
    </>
  );
}

DashboardPage.getLayout = getDashboardLayout;
