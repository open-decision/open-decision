import * as React from "react";
import { NodeEditor } from "features/Builder/NodeEditor";
import { EditorProvider } from "features/Builder/state/useEditor";
import { ReactFlowProvider } from "react-flow-renderer";
import { EditorHeader } from "features/Builder/components/EditorHeader";
import { SideMenu } from "features/Builder/SideMenu";
import { BuilderLayout } from "../../../features/Builder/components/BuilderLayout";
import { Layout } from "../../../components";

export default function BuilderPage() {
  return (
    <ReactFlowProvider>
      <EditorProvider>
        <EditorHeader
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
  );
}

BuilderPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <BuilderLayout>
      <Layout
        css={{
          display: "grid",
          gridTemplateColumns: `max-content 1fr`,
          gridTemplateRows: "max-content 1fr",
        }}
      >
        {page}
      </Layout>
    </BuilderLayout>
  );
};
