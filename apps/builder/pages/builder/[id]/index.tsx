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

export default function BuilderPage() {
  const treeId = useTreeId();

  return treeId ? (
    <>
      <Head>
        <title>Open Decision Builder</title>
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
