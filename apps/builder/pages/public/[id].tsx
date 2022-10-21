import * as React from "react";
import { client } from "@open-decision/api-client";
import { safeFetch } from "@open-decision/api-helpers";
import { LoadingSpinner, Stack } from "@open-decision/design-system";
import { Renderer } from "@open-decision/renderer";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useTranslations } from "next-intl";
import Head from "next/head";
import {
  publicTreeQueryKey,
  usePublicTree,
} from "../../features/Data/usePublicTree";
import { FullPageErrorFallback } from "../../components/Error/FullPageErrorFallback";
import { ODError } from "@open-decision/type-classes";
import { Layout } from "../../components";
import { useNotificationStore } from "../../config/notifications";
import { useTreeClient } from "../../features/Builder/components/TreeClient";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
  locale,
}) => {
  const id =
    typeof params?.["id"] === "object" ? params?.["id"][0] : params?.["id"];
  if (!id) return { redirect: { destination: "/public", permanent: false } };

  const messages = await import(`@open-decision/translations`).then(
    (translations) => ({
      common: translations.de.common,
      renderer: translations.de.renderer,
    })
  );

  const OD = client({
    token: req.cookies["token"],
    urlPrefix: `${process.env["NEXT_PUBLIC_OD_API_ENDPOINT"]}/v1`,
    fetchFunction: safeFetch,
  });

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(publicTreeQueryKey(id), () =>
    OD.publishedTrees.getSingle({
      params: { uuid: id },
    })
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      messages,
      locale,
      now: new Date().toISOString(),
      treeId: id,
    },
  };
};

type PageProps = { treeId: string };

export default function Page({ treeId }: PageProps) {
  const { addNotification } = useNotificationStore();
  const t = useTranslations();
  const { isLoading, data, isSuccess } = usePublicTree(treeId, {
    select: (result) => result.data.treeData,
    staleTime: Infinity,
  });
  const { interpreterResolver, nodePlugins } = useTreeClient();

  if (isLoading) return <LoadingSpinner />;
  if (!isSuccess)
    return <FullPageErrorFallback error={new ODError({ code: "NOT_FOUND" })} />;

  return (
    <>
      <Head>
        <title>{t("renderer.pageTitle")}</title>
      </Head>
      <Layout>
        <Renderer.Root
          resolver={interpreterResolver}
          tree={data}
          onError={(error) =>
            addNotification({
              title: t(`common.errors.${error.code}.short`),
              content: t(`common.errors.${error.code}.long`),
              variant: "danger",
            })
          }
        >
          <Stack center css={{ layer: "2", height: "100%" }}>
            <Renderer.View
              css={{
                marginBlock: "$2",
                paddingInline: "$4",
                paddingBlock: "$4",
                height: "100%",
                maxWidth: "700px",

                "@desktop": {
                  marginBlock: "$4",
                },
              }}
              inputPlugins={nodePlugins.question.plugin.inputPlugins}
              nodePlugins={nodePlugins}
            />
          </Stack>
        </Renderer.Root>
      </Layout>
    </>
  );
}
