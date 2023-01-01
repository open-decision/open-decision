import * as React from "react";
import {
  Notifications,
  Tooltip,
  useNotificationSnapshot,
} from "@open-decision/design-system";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { NextPage } from "next";
import { NextIntlProvider, useTranslations } from "next-intl";
import { useUrlNotification } from "../utils/useUrlNotification";
import { convertToODError } from "@open-decision/type-classes";
import { FullPageErrorFallback } from "../components/Error/FullPageErrorFallback";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Router } from "next/router";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import "reactflow/dist/style.css";
import "@open-decision/design-system/index.css";
import { MessagesContext } from "@open-decision/translations";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useQueryClient } from "../features/Data/useQueryClient";

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

const ErrorFallback = ({ error }: FallbackProps) => {
  return <FullPageErrorFallback error={convertToODError(error)} />;
};

function App({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  const getLayout = Component.getLayout || ((page) => page);

  useUrlNotification();
  const queryClient = useQueryClient();
  const t = useTranslations("common.notificationsGeneral");

  const notificationState = useNotificationSnapshot();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Notifications
            state={notificationState}
            closeLabel={t("closeIconHiddenLabel")}
          />
          <Tooltip.Provider>
            {getLayout(<Component {...pageProps} />)}
          </Tooltip.Provider>
        </Hydrate>
        {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default function AppWithContext({
  Component,
  pageProps,
}: AppPropsWithLayout): JSX.Element {
  const [isLoading, setIsLoading] = React.useState(false);

  Router.events.on("routeChangeStart", () => {
    setIsLoading(true);
  });

  React.useEffect(() => {
    Router.events.on("routeChangeComplete", () => {
      setIsLoading(false);
    });
  });

  const variants: Variants = {
    empty: { width: "0%", height: 3 },
    load: {
      width: "90%",
      height: 3,
      zIndex: 100,
      transition: { duration: 1, ease: "easeIn" },
    },
    exit: {
      width: "100%",
      height: 0,
      zIndex: 100,
      transition: { duration: 0.1 },
    },
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial="empty"
            animate="load"
            variants={variants}
            exit="exit"
            className="bg-primary10 absolute"
          />
        ) : null}
      </AnimatePresence>
      <NextIntlProvider
        now={new Date(pageProps.now)}
        locale={pageProps.locale}
        messages={pageProps.messages}
      >
        <MessagesContext.Provider value={pageProps.messages}>
          <App pageProps={pageProps} Component={Component} />
        </MessagesContext.Provider>
      </NextIntlProvider>
    </>
  );
}
