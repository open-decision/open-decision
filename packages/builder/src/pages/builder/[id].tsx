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
import { yDoc } from "features/Builder/state/treeStore/treeStore";
import {
  connectLocalStorage,
  connectWebsocket,
} from "features/Data/yjs-connectors";
import { useAuth } from "features/Auth/useAuth";
import { WebsocketProvider } from "y-websocket";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { id: context.params?.id },
  };
};

export default function BuilderPage({ id }): JSX.Element {
  const [auth] = useAuth();

  React.useEffect(() => {
    let websocket: WebsocketProvider | null;
    if (auth.context.user?.access.token) {
      connectLocalStorage(yDoc, id);
      websocket = connectWebsocket(yDoc, id, auth.context.user?.access.token);
    }

    return () => websocket?.destroy();
  }, [auth.context.user?.access.token, id]);

  return (
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
          <ReactFlowProvider>
            <EditorProvider>
              <EditorHeader css={{ gridColumn: "1 / -1", gridRow: "1" }} />
              <NodeEditor css={{ gridColumn: "1 / -1", gridRow: "2" }} />
            </EditorProvider>
          </ReactFlowProvider>
        </MainContent>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
