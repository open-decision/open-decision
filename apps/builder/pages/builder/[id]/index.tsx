import * as React from "react";
import { NodeEditor } from "../../../features/Builder/NodeEditor";
import { EditorProvider } from "../../../features/Builder/state/useEditor";
import { ReactFlowProvider } from "react-flow-renderer";
import { EditorHeader } from "../../../features/Builder/components/EditorHeader";
import { SideMenu } from "../../../features/Builder/components/SideMenu/SideMenu";
import { Layout } from "../../../components";
import { BuilderLayout } from "../../../features/Builder/components/BuilderLayout";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { useTranslations } from "next-intl";
import { Tabs } from "@open-decision/design-system";
import { Preview } from "../../../features/Preview/Preview";
import { AnimatePresence, motion } from "framer-motion";
import { PrototypButton } from "../../../features/Builder/components/PrototypButton";
import { CreateNodeButton } from "../../../features/Builder/components/CreateNodeButton";

export const getServerSideProps: GetServerSideProps<
  any,
  { id: string }
> = async ({ params, locale }) => {
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
                      <NodeEditor />
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
      </Tabs.Root>
    </>
  );
}

BuilderPage.getLayout = function getLayout(page: React.ReactElement) {
  return <BuilderLayout>{page}</BuilderLayout>;
};
