import * as React from "react";
import { NodeEditor } from "../../../features/Builder/NodeEditor";
import { EditorProvider } from "../../../features/Builder/state/useEditor";
import { ReactFlowProvider } from "react-flow-renderer";
import { EditorHeader } from "../../../features/Builder/components/EditorHeader";
import { SideMenu } from "../../../features/Builder/SideMenu";
import { Layout } from "../../../components";
import { BuilderLayout } from "../../../features/Builder/components/BuilderLayout";
import { useTreeId } from "../../../features/Data/useTreeId";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { useTranslations } from "next-intl";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { client } from "@open-decision/api-client";
import { treeQueryKey } from "../../../features/Data/useTreeAPI";
import { safeFetch } from "@open-decision/api-helpers";

export const getServerSideProps: GetServerSideProps<
  any,
  { id: string }
> = async ({ req, params, locale }) => {
  const messages = await import(`@open-decision/translations`).then(
    (translations) => ({
      common: translations.de.common,
      builder: translations.de.builder,
    })
  );

  if (!params)
    return {
      redirect: {
        destination: "/",
      },
      props: {},
    };

  const OD = client({
    token: req.cookies["token"],
    urlPrefix: `${process.env.NEXT_PUBLIC_OD_API_ENDPOINT}/v1`,
    fetchFunction: safeFetch,
  });
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(treeQueryKey(params.id), () =>
    OD.trees.getSingle({ params: { uuid: params.id } })
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

export default function BuilderPage() {
  const t = useTranslations("builder");
  const treeId = useTreeId();

  return treeId ? (
    <>
      <Head>
        <title>{t("pageTitle")}</title>
      </Head>
      <Layout
        css={{
          display: "grid",
          gridTemplateColumns: `max-content 1fr`,
          gridTemplateRows: "max-content 1fr",
        }}
      >
        <ReactFlowProvider>
          <EditorProvider>
            <EditorHeader
              treeId={treeId}
              css={{
                gridColumn: "1 / -1",
                gridRow: "1",
              }}
            />
            <SideMenu css={{ gridRow: "2", gridColumn: "1", layer: "1" }} />
            <NodeEditor
              css={{
                gridColumn: "2 / 3",
                gridRow: "2",
              }}
            />
          </EditorProvider>
        </ReactFlowProvider>
      </Layout>
    </>
  ) : null;
}

BuilderPage.getLayout = function getLayout(page: React.ReactElement) {
  return <BuilderLayout>{page}</BuilderLayout>;
};
