import { LoadingSpinner, Stack } from "@open-decision/design-system";
import * as React from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { Renderer } from "@open-decision/renderer";
import { useTranslations } from "next-intl";
import { useTreeAPI } from "../../../features/Data/useTreeAPI";
import { APIError } from "@open-decision/type-classes";

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

  const { data: hasPreview, error: previewEnabledError } =
    useTreeAPI().useTreeQuery(treeId, {
      select: (result) => {
        if (!result.data.hasPreview)
          throw new APIError({ code: "PREVIEW_NOT_ENABLED" });

        return result.data.hasPreview;
      },
    });

  const { isLoading, isPaused, data, error, isSuccess } =
    useTreeAPI().useTreeData(treeId, {
      select: (result) => result.data,
      staleTime: Infinity,
      enabled: hasPreview,
    });

  if (previewEnabledError) throw previewEnabledError;
  if (isPaused || isLoading) return <LoadingSpinner />;
  if (!isSuccess) throw error;

  return (
    <>
      <Head>
        <title>{t("pageTitle")}</title>
      </Head>
      <Renderer.Root tree={data}>
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
          />
        </Stack>
      </Renderer.Root>
    </>
  );
}
