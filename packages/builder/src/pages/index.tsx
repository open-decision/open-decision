import { Box, styled } from "@open-decision/design-system";
import { ErrorBoundary } from "@sentry/nextjs";
import { BaseHeader, MainContent } from "components";
import { TreeList } from "features/Dashboard/TreeList";
import { ErrorFallback } from "features/Error/ErrorFallback";
import * as React from "react";

const DashboardGrid = styled(MainContent, {
  display: "grid",
  height: "100vh",
  overflow: "hidden",
  gridTemplateRows: "max-content max-content 1fr",
  gridTemplateColumns: `1fr minmax(800px, 1fr) 1fr`,
  layer: "2",
});

export default function DashboardPage() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <DashboardGrid>
        <BaseHeader css={{ gridColumn: "1 / -1" }}>
          <Box css={{ flex: 1 }} />
        </BaseHeader>
        <TreeList />
      </DashboardGrid>
    </ErrorBoundary>
  );
}
