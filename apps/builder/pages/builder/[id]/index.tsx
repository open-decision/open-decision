import * as React from "react";
import { EditorProvider, NodeEditor } from "@open-decision/node-editor";
import { ReactFlowProvider } from "react-flow-renderer";
import { EditorHeader } from "../../../features/Builder/components/EditorHeader";
import { SideMenu } from "../../../features/Builder/components/SideMenu/SideMenu";
import { Layout } from "../../../components";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { useTranslations } from "next-intl";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { client } from "@open-decision/api-client";
import { treeQueryKey } from "../../../features/Data/useTreeAPI";
import { safeFetch } from "@open-decision/api-helpers";
import { Tabs } from "@open-decision/design-system";
import { Preview } from "../../../features/Preview/Preview";
import { AnimatePresence, motion } from "framer-motion";
import { PrototypButton } from "../../../features/Builder/components/PrototypButton";
import { CreateNodeButton } from "../../../features/Builder/components/CreateNodeButton";
import dynamic from "next/dynamic";
import {
  NodeSidebarPlugin,
  nodeTypes,
} from "@open-decision/node-plugins-adapter";

const TreeProvider = dynamic(() => import("@open-decision/tree-sync"), {
  ssr: false,
});

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
    urlPrefix: `${process.env["NEXT_PUBLIC_OD_API_ENDPOINT"]}/v1`,
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
      treeId: params.id,
    },
  };
};

type PageProps = { treeId: string };

export default function BuilderPage({ treeId }: PageProps) {
  const [selectedView, setSelectedView] = React.useState("editor");

  const t = useTranslations("builder");

  return (
    <>
      <Head>
        <title>{t("pageTitle")}</title>
      </Head>
      <Tabs.Root
        defaultValue={selectedView}
        onValueChange={setSelectedView}
        asChild
      >
        <TreeProvider id={treeId}>
          <Layout
            css={{
              layer: "3",
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
                    zIndex: "$20",
                  }}
                >
                  <PrototypButton treeId={treeId} />
                </EditorHeader>
                <SideMenu
                  selectedView={selectedView}
                  css={{
                    gridRow: "2",
                    gridColumn: "1",
                    layer: "1",
                    gap: "$2",
                    zIndex: "$10",
                  }}
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
                      css={{
                        gridColumn: "2 / 3",
                        gridRow: "2",
                        height: "100%",
                        overflow: "hidden",
                      }}
                      asChild
                    >
                      <motion.div
                        key="editor"
                        initial={{ opacity: 0, x: "-10%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "-10%" }}
                        transition={{
                          duration: 0.2,
                          ease: "easeInOut",
                        }}
                      >
                        <NodeEditor
                          NodeSidebarPlugin={<NodeSidebarPlugin node={} />}
                          nodeTypes={nodeTypes}
                        />
                      </motion.div>
                    </Tabs.Content>
                  ) : null}
                  {selectedView === "preview" ? (
                    <Tabs.Content
                      forceMount
                      key="preview"
                      value="preview"
                      css={{
                        gridColum: "2 / 3",
                        gridRow: "2",
                      }}
                      asChild
                    >
                      <motion.div
                        key="preview"
                        initial={{ opacity: 0, x: "10%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "10%" }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Preview
                          css={{
                            flex: "1 1 700px",
                            maxWidth: "700px",
                          }}
                        />
                      </motion.div>
                    </Tabs.Content>
                  ) : null}
                </AnimatePresence>
              </EditorProvider>
            </ReactFlowProvider>
          </Layout>
        </TreeProvider>
      </Tabs.Root>
    </>
  );
}
