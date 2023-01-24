import * as React from "react";
import {
  addNotification,
  LoadingSpinner,
  Stack,
} from "@open-decision/design-system";
import { Renderer } from "@open-decision/renderer";
import { GetServerSideProps } from "next";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { usePublicTree } from "../../features/Data/usePublicTree";
import { FullPageErrorFallback } from "../../components/Error/FullPageErrorFallback";
import { ODError } from "@open-decision/type-classes";
import { Layout } from "../../components";
import { createTreeClientWithPlugins } from "@open-decision/tree-client";

export const getServerSideProps: GetServerSideProps = async ({
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

  return {
    props: {
      messages,
      locale,
      now: new Date().toISOString(),
      treeUuid: id,
    },
  };
};

type PageProps = { treeUuid: string };

export default function Page({ treeUuid }: PageProps) {
  const t = useTranslations();
  const { isLoading, data, isSuccess } = usePublicTree(treeUuid, {
    select: (result) => result.data.treeData,
    staleTime: Infinity,
  });

  const { nodePlugins, edgePlugins } = createTreeClientWithPlugins(
    treeUuid,
    data
  );

  if (isLoading)
    return (
      <Stack center className="h-full">
        <LoadingSpinner />
      </Stack>
    );
  if (!isSuccess)
    return <FullPageErrorFallback error={new ODError({ code: "NOT_FOUND" })} />;

  return (
    <>
      <Head>
        <title>{t("renderer.pageTitle")}</title>
      </Head>
      <Layout>
        <Renderer.Root
          treeUuid={treeUuid}
          environment="published"
          edgePlugins={edgePlugins}
          tree={data}
          onError={(error) =>
            addNotification({
              title: t(`common.errors.${error.code}.short`),
              content: t(`common.errors.${error.code}.long`),
              variant: "danger",
            })
          }
        >
          <Stack center className="bg-layer-2 h-full">
            <Renderer.View
              treeUuid={treeUuid}
              className="mb-2 p-4 h-full max-w-[700px] lg:mb-4"
              nodePlugins={nodePlugins}
              edgePlugins={edgePlugins}
            />
          </Stack>
        </Renderer.Root>
      </Layout>
    </>
  );
}
