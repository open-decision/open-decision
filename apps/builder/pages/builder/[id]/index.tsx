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
import { LoadingSpinner, Stack, Tabs } from "@open-decision/design-system";
import { Preview } from "../../../features/Preview/Preview";
import { AnimatePresence, motion } from "framer-motion";
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
  const [selectedView, setSelectedView] = React.useState("editor");

  const { nodePlugins, edgePlugins } = useTreeClientWithPlugins();

  return (
    <Tabs.Root
      asChild
      defaultValue={selectedView}
      onValueChange={setSelectedView}
    >
      <Layout className="bg-layer-3 grid grid-cols-[max-content_1fr] grid-rows-[max-content_1fr]">
        <EditorHeader treeId={treeId} className="col-span-full row-span-1 z-20">
          <PrototypButton treeId={treeId} />
        </EditorHeader>
        <SideMenu
          selectedView={selectedView}
          className="col-span-1 row-span-1 z-10 gap-2 bg-layer-1"
        >
          <AnimatePresence>
            {selectedView === "editor" ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.15,
                  ease: "easeOut",
                }}
              >
                <CreateNodeButton />
              </motion.span>
            ) : null}
          </AnimatePresence>
        </SideMenu>
        <AnimatePresence mode="wait" initial={false}>
          {selectedView === "editor" ? (
            <Tabs.Content
              forceMount
              key="editor"
              value="editor"
              className="col-[2] row-[2] h-full overflow-hidden"
              asChild
            >
              <motion.div
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.2,
                  type: "tween",
                }}
              >
                <NodeEditor
                  nodePlugins={nodePlugins}
                  edgePlugins={edgePlugins}
                  className="h-full"
                  defaultViewport={defaultViewport}
                  onUnmount={(viewport) => setDefaultViewport(viewport)}
                />
              </motion.div>
            </Tabs.Content>
          ) : null}
          {selectedView === "preview" ? (
            <Tabs.Content
              forceMount
              key="preview"
              value="preview"
              className="col-2 row-2 h-full overflow-hidden"
              asChild
            >
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, type: "tween" }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Preview
                  environment="preview"
                  className="flex basis-[700px] max-w-[700px] auroa-theme"
                />
              </motion.div>
            </Tabs.Content>
          ) : null}
        </AnimatePresence>
      </Layout>
    </Tabs.Root>
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
