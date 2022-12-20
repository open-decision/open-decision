import { LoadingSpinner, Stack } from "@open-decision/design-system";
import * as React from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { Renderer } from "@open-decision/renderer";
import { useTranslations } from "next-intl";
import { useTreeAPI } from "../../../features/Data/useTreeAPI";
import { createTreeClientWithPlugins } from "@open-decision/tree-client";

export const getServerSideProps: GetServerSideProps<
  any,
  { id: string }
> = async ({ params, locale }) => {
  const messages = await import(`@open-decision/translations`).then(
    (translations) => ({
      common: translations.de.common,
      renderer: translations.de.renderer,
    })
  );

  if (!params)
    return {
      redirect: {
        destination: "/",
      },
      props: {},
    };

  return {
    props: {
      messages,
      locale,
      now: new Date().toISOString(),
      treeId: params.id,
    },
  };
};

type PageProps = { treeId: string };

export default function VorschauPage({ treeId }: PageProps) {
  const t = useTranslations("renderer.preview");

  const { isLoading, isPaused, data, error, isSuccess } =
    useTreeAPI().useTreePreview(treeId, {
      select: (result) => result.data,
      staleTime: Infinity,
    });

  const treeClientWithPlugins = data
    ? createTreeClientWithPlugins(data)
    : undefined;
  if (isPaused || isLoading) return <LoadingSpinner />;
  if (!isSuccess || !treeClientWithPlugins) throw error;

  return (
    <>
      <Head>
        <title>{t("pageTitle")}</title>
      </Head>
      <Renderer.Root
        tree={data}
        edgePlugins={treeClientWithPlugins.edgePlugins}
        environment="prototype"
      >
        <Stack center className="bg-layer-2 h-full auroa-theme">
          <Renderer.View
            className="mb-2 px-4 py-4 h-full max-w-[700px] lg:mb-4"
            nodePlugins={treeClientWithPlugins.nodePlugins}
          />
        </Stack>
      </Renderer.Root>
    </>
  );
}
