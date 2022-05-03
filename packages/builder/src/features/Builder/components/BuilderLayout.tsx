import { Box, LoadingSpinner } from "@open-decision/design-system";
import { ErrorBoundary } from "@sentry/nextjs";
import * as React from "react";
import { ErrorFallback } from "../../Error/ErrorFallback";
import { TreeProvider } from "../state/treeStore/TreeContext";

function Loading() {
  return (
    <Box
      css={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <LoadingSpinner size="50px" />
    </Box>
  );
}

type BuilderLayoutProps = { children: React.ReactNode };

export function BuilderLayout({ children }: BuilderLayoutProps) {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <React.Suspense fallback={<Loading />}>
        <TreeProvider>{children}</TreeProvider>
      </React.Suspense>
    </ErrorBoundary>
  );
}
