import * as React from "react";
import type { AppProps } from "next/app";
import "../design/index.css";
import { Box, globalStyles, Tooltip } from "@open-decision/design-system";
import { AuthProvider, useAuth } from "../features/Auth/useAuth";
import { useRouter } from "next/router";
import { protectedRoutes } from "../config/protectedRoutes";
import { queryClient } from "../features/Data/queryClient";
import { QueryClientProvider } from "react-query";
import { NextPage } from "next";
import { inspect } from "@xstate/inspect";
import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";
import { ReactQueryDevtools } from "react-query/devtools";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  inspect({
    iframe: false,
  });
}

if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  LogRocket.init("open-decision/open-decision", {});
  setupLogRocketReact(LogRocket);
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
  const router = useRouter();

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <AuthProvider router={router}>
      <QueryClientProvider client={queryClient}>
        <Tooltip.Provider delayDuration={50}>
          <ProtectedRoute>
            {getLayout(<Component {...pageProps} />)}
          </ProtectedRoute>
        </Tooltip.Provider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </AuthProvider>
  );
}

type ProtectedRouteProps = { children: React.ReactNode };

function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
  const [state] = useAuth();
  const { pathname } = useRouter();

  if (
    (!state.matches("loggedIn") &&
      protectedRoutes.some((routeRegEx) => routeRegEx.test(pathname))) ||
    state.matches("undetermined")
  )
    return <Box />;

  return <>{children}</>;
}
