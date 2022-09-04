import * as React from "react";
import "../design/index.css";
import { globalStyles, Tooltip } from "@open-decision/design-system";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { NextPage } from "next";
import { useUrlNotification } from "../features/Notifications/useUrlNotification";
import { useQueryClient } from "../features/Data/useQueryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { convertToODError } from "@open-decision/type-classes";
import { ErrorBoundary } from "@sentry/nextjs";
import { FullPageErrorFallback } from "../components/Error/FullPageErrorFallback";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useNotificationStore } from "../config/notifications";

// ------------------------------------------------------------------
// xstate devtools
// import { inspect } from "@xstate/inspect";
// if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
//   inspect({
//     iframe: false,
//   });
// }
// ------------------------------------------------------------------

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = {
  Component: NextPageWithLayout;
  pageProps: any;
};

function App({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  globalStyles();
  const getLayout = Component.getLayout || ((page) => page);

  useUrlNotification();
  const queryClient = useQueryClient();

  return (
    <ErrorBoundary
      fallback={({ error }) => {
        return <FullPageErrorFallback error={convertToODError(error)} />;
      }}
    >
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Tooltip.Provider delayDuration={50}>
          {getLayout(<Component {...pageProps} />)}
        </Tooltip.Provider>
        {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
      </Hydrate>
    </QueryClientProvider>
  );
}

export default function AppWithContext({
  Component,
  pageProps,
}: AppPropsWithLayout): JSX.Element {
  return (
    <NextIntlProvider
      now={new Date(pageProps.now)}
      locale={pageProps.locale}
      messages={pageProps.messages}
    >
      <App pageProps={pageProps} Component={Component} />
    </NextIntlProvider>
  );
}
