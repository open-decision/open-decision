import * as React from "react";
import type { AppProps } from "next/app";
import "../design/index.css";
import { globalStyles, Tooltip } from "@open-decision/design-system";
import { queryClient } from "../features/Data/queryClient";
import { QueryClientProvider } from "react-query";
import { NextPage } from "next";
import { inspect } from "@xstate/inspect";
import { ReactQueryDevtools } from "react-query/devtools";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  inspect({
    iframe: false,
  });
}

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

  return (
    <QueryClientProvider client={queryClient}>
      <Tooltip.Provider delayDuration={50}>
        {getLayout(<Component {...pageProps} />)}
      </Tooltip.Provider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
