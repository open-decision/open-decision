import { LoadingSpinner, Stack } from "@open-decision/design-system";
import { ErrorBoundary } from "@sentry/nextjs";
import { BaseHeader } from "../components";
// import { TreeList } from "../features/Dashboard/TreeList";
import * as React from "react";
import { ErrorCard } from "../components/Error/ErrorCard";
import { getDashboardLayout } from "../features/Dashboard/DashboardLayout";
import dynamic from "next/dynamic";

const TreeList = dynamic(() => import("../features/Dashboard/TreeList"), {
  ssr: false,
});

export default function DashboardPage() {
  return (
    <>
      <BaseHeader css={{ gridColumn: "1 / -1" }} />
      <ErrorBoundary
        fallback={
          <Stack center css={{ gridColumn: "2 / 4", gridRow: "2 / 4" }}>
            <ErrorCard title="Beim laden ihrer Bäume ist ein Fehler aufgetreten." />
          </Stack>
        }
      >
        <Stack
          css={{
            gridColumn: "2 / 4",
            gridRow: "2 / 4",
          }}
        >
          <React.Suspense
            fallback={
              <LoadingSpinner
                size="50px"
                css={{ flex: 1, alignSelf: "center" }}
              />
            }
          >
            <TreeList />
          </React.Suspense>
        </Stack>
      </ErrorBoundary>
    </>
  );
}

DashboardPage.getLayout = getDashboardLayout;
