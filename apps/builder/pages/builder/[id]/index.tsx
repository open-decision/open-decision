import * as React from "react";
import {
  EditorProvider,
  NodeEditor,
  ReactFlowProvider,
} from "@open-decision/node-editor";
import { EditorHeader } from "../../../features/Builder/components/EditorHeader";
import { SideMenu } from "../../../features/Builder/components/SideMenu/SideMenu";
import { Layout } from "../../../components";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { useTranslations } from "next-intl";
import { LoadingSpinner, Stack } from "@open-decision/design-system";
import { PrototypButton } from "../../../features/Builder/components/PrototypButton";
import { CreateNodeButton } from "../../../features/Builder/components/CreateNodeButton";
import dynamic from "next/dynamic";
import { useTreeClientWithPlugins } from "@open-decision/tree-clientWithPlugins";

const TreeProvider = dynamic(() => import("@open-decision/tree-sync"), {
  ssr: false,
});

export const getServerSideProps: GetServerSideProps<
  any,
  { id: string }
> = async ({ params, locale }) => {
  const messages = await import(`@open-decision/translations`).then(
    (translations) => ({
      common: translations.de.common,
      builder: translations.de.builder,
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

const Content = ({ treeId }: PageProps) => {
  const [defaultViewport, setDefaultViewport] = React.useState<
    { x: number; y: number; zoom: number } | undefined
  >(undefined);

  const { nodePlugins, edgePlugins } = useTreeClientWithPlugins();

  return (
    <Layout className="bg-layer-3 grid grid-cols-[max-content_1fr] grid-rows-[max-content_1fr]">
      <EditorHeader treeId={treeId} className="col-span-full row-span-1 z-20">
        <PrototypButton treeId={treeId} />
      </EditorHeader>
      <SideMenu className="col-span-1 row-span-1 z-10 gap-2 bg-layer-1">
        <CreateNodeButton />
      </SideMenu>
      <NodeEditor
        nodePlugins={nodePlugins}
        edgePlugins={edgePlugins}
        className="col-[2] row-[2] h-full overflow-hidden"
        defaultViewport={defaultViewport}
        onUnmount={(viewport) => setDefaultViewport(viewport)}
      />
    </Layout>
  );
};

export default function BuilderPage({ treeId }: PageProps) {
  const t = useTranslations("builder");

  return (
    <>
      <Head>
        <title>{t("pageTitle")}</title>
      </Head>
      <ReactFlowProvider>
        <TreeProvider id={treeId}>
          <React.Suspense
            fallback={
              <Stack center className="h-full">
                <LoadingSpinner />
              </Stack>
            }
          >
            <EditorProvider>
              <Content treeId={treeId} />
            </EditorProvider>
          </React.Suspense>
        </TreeProvider>
      </ReactFlowProvider>
    </>
  );
}
