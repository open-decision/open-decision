import * as React from "react";
import { NodeEditor } from "features/Builder/NodeEditor";
import { EditorProvider } from "features/Builder/state/useEditor";
import { ReactFlowProvider } from "react-flow-renderer";
import { EditorHeader } from "features/Builder/components/EditorHeader";
import { ErrorBoundary } from "@sentry/nextjs";
import { ErrorFallback } from "features/Error/ErrorFallback";
import { GetServerSideProps } from "next";
import { TreeProvider } from "features/Builder/state/treeStore/TreeContext";
import { Box, LoadingSpinner } from "@open-decision/design-system";
import { SideMenu } from "features/Builder/SideMenu";
import { Layout } from "../../../components/Layout";

function Loading() {
  return (
    <Box
      css={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gridColumn: "1 / -1",
        gridRow: "1 / -1",
      }}
    >
      <LoadingSpinner size="50px" />
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { id: context.params?.id },
  };
};

export default function BuilderPage({ id }) {
  return (
    <TreeProvider id={id}>
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
    </TreeProvider>
  );
}

BuilderPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Layout
        css={{
          display: "grid",
          gridTemplateColumns: `max-content 1fr`,
          gridTemplateRows: "max-content 1fr",
        }}
      >
        <React.Suspense fallback={<Loading />}>{page}</React.Suspense>
      </Layout>
    </ErrorBoundary>
  );
};
