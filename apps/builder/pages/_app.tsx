import * as React from "react";
import type { AppProps } from "next/app";
import "../design/index.css";
import { globalStyles, Tooltip } from "@open-decision/design-system";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { NextPage } from "next";
import { useUrlNotification } from "../features/Notifications/useUrlNotification";
import { useQueryClient } from "../features/Data/useQueryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
export default function App({
  Component,
  pageProps,
}: AppPropsWithLayout): JSX.Element {
  globalStyles();
  const getLayout = Component.getLayout || ((page) => page);

  useUrlNotification();
  const queryClient = useQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Tooltip.Provider delayDuration={50}>
          {getLayout(<Component {...pageProps} />)}
        </Tooltip.Provider>
        <ReactQueryDevtools />
      </Hydrate>
    </QueryClientProvider>
  );
}
