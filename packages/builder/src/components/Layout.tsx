import React from "react";
import { Notifications } from "features/Notifications/Notifications";
import { Box, LoadingSpinner, styled } from "@open-decision/design-system";
import { ErrorBoundary } from "@sentry/nextjs";
import { ErrorFallback } from "./Error/FullPageErrorFallback";

const AppContainer = styled("main", {
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  layer: "2",
});

function Loading() {
  return (
    <Box
      css={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        layer: "2",
      }}
    >
      <LoadingSpinner size="60px" />
    </Box>
  );
}

export const LayoutImpl = (
  { children, ...props }: React.ComponentProps<typeof AppContainer>,
  ref: React.Ref<HTMLElement>
): JSX.Element => {
  return (
    <ErrorBoundary
      fallback={({ error }) => {
        console.log(error);
        return (
          <ErrorFallback
            title="Es ist ein Fehler aufgetreten."
            description={`${error.message} Bitte laden Sie die Seite neu.`}
            {...props}
          />
        );
      }}
    >
      <React.Suspense fallback={<Loading {...props} />}>
        <AppContainer {...props} ref={ref}>
          <Notifications />
          {children}
        </AppContainer>
      </React.Suspense>
    </ErrorBoundary>
  );
};

export const Layout = React.forwardRef(LayoutImpl);
