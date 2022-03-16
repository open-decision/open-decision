import * as React from "react";
import { MainContent } from "components/Layout";
import { NodeEditor } from "features/Builder/NodeEditor";
import { EditorProvider } from "features/Builder/state/useEditor";
import { sidebarWidth } from "features/Builder/utilities/constants";
import { ReactFlowProvider } from "react-flow-renderer";
import { EditorHeader } from "features/Builder/components/EditorHeader";
import { ErrorBoundary } from "@sentry/nextjs";
import { ErrorFallback } from "features/Error/ErrorFallback";
import { QueryClientProvider } from "react-query";
import { queryClient } from "features/Data/queryClient";
import { GetServerSideProps } from "next";
import { TreeProvider } from "features/Builder/state/treeStore/TreeProvider";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { id: context.params?.id },
  };
};

export default function BuilderPage({ id }): JSX.Element {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={ErrorFallback}>
        <QueryClientProvider client={queryClient}>
          <MainContent
            css={{
              overflow: "hidden",
              display: "grid",
              gridTemplateColumns: `1fr ${sidebarWidth}px`,
              gridTemplateRows: "max-content 1fr",
            }}
          >
            <TreeProvider id={id}>
              <ReactFlowProvider>
                <EditorProvider>
                  <EditorHeader css={{ gridColumn: "1 / -1", gridRow: "1" }} />
                  <NodeEditor css={{ gridColumn: "1 / -1", gridRow: "2" }} />
                </EditorProvider>
              </ReactFlowProvider>
            </TreeProvider>
          </MainContent>
        </QueryClientProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
}
